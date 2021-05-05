const jwt                       = require('jsonwebtoken');
const crypto                    = require('crypto');
const passport                  = require('passport');
const { Sequelize, QueryTypes } = require('sequelize');

const jwtSecretKey    = require('../config/secretKey').jwtSecretKey;
const jwtOptions      = require('../config/secretKey').jwtOptions;
const cookieOptions   = require('../config/secretKey').cookieOptions;
const { transporter } = require('../config/email');

const User        = require('../models/users');
const Provider    = require('../models/providers');
const Post        = require('../models/posts');
const Reply       = require('../models/replies');
const Token       = require('../models/tokens');
const Scrap       = require('../models/scraps');
const Directory   = require('../models/directories');
const MainMajor   = require('../models/mainMajors');
const DoubleMajor = require('../models/doubleMajors');


const emailAuth = {
    sendEmail: async(req, res) => {
        const token  = crypto.randomBytes(20).toString('hex');
        
        let toWhom;
        if (req.cookies['user']) {
            toWhom = req.user.webMail;
        } else {
            toWhom = req.body.webMail;
        }
        
        const mailOptions = {
            from: "HUFSpace",
            to: `${toWhom}@hufs.ac.kr`,
            subject: "[ HUFSpace ] 회원가입을 위한 이메일입니다.",
            text: "인증을 위해 아래 URL을 클릭하여 주세요.\n" + `https://hufspace.com/email?token=${token}`
        };

        await transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
                return res.status(error.responseCode).json(
                    {
                        code: error.responseCode,
                        message: error.response
                    }
                )
            } else {
                try {
                    date = new Date();
                    const jwtToken = req.cookies['user'];
                    if (jwtToken) {
                        req.user = jwt.verify(jwtToken, jwtSecretKey);
                        await Token.update(
                            {
                                emailToken: token,
                                emailExpirationTime: date
                            },
                            {
                                where: {userId: req.user.id}
                            }
                        )
                        return res.status(200).json(
                            {
                                data: "",
                                message: ""
                            }
                        )
                    } else {
                        await Token.create( 
                            {
                                emailToken         : token,
                                emailExpirationTime: date,
                                userId             : req.user.id
                            }
                        );
                        
                        const payload = {
                            id      : req.user.id,
                            webMail : req.user.webMail,
                            type    : req.user.type
                        };
                        accessToken = jwt.sign(payload, jwtSecretKey, jwtOptions);
                        return res.cookie(
                            'user',
                            accessToken,
                            cookieOptions
                        ).status(200).json(
                            {
                                data: "",
                                message: ""
                            }
                        );
                    }
                } catch (error) {
                    return res.status(500).json(
                        {
                            data: "",
                            message: error.message
                        }
                    )
                }
            }
            transporter.close()
        });
    },

    checkEmail: async(req, res, next) => {
        try {
            console.log(req.query)
            if (!req.query.token) {
                return res.status(401).json(
                    {
                        data: "",
                        message: "UNAUTHORIZED"
                    }
                )
            } else {
                const token = await Token.findOne(
                    { where: { emailToken: req.query.token } }
                );

                if (token.isEmailAuthenticated) {
                    return res.status(409).json(
                        {
                            data: "",
                            message: "CONFLICT"
                        }
                    );
                }

                const today = new Date()
                const date  = token.emailExpirationTime
                const hour  = Math.floor((today - date) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));

                if (hour < 24) {
                    const user = await User.findOne({where: {id: token.userId}});

                    user.type = 'user'
                    user.save()

                    token.isEmailAuthenticated = true
                    token.emailExpirationTime  = null
                    token.save()

                    await Directory.create({userId: user.id})

                    const payload = {
                        id      : user.id,
                        email   : user.webMail,
                        type    : user.type
                    };
                    accessToken = jwt.sign(payload, jwtSecretKey, jwtOptions);

                    return res.cookie(
                        'user',
                        accessToken,
                        cookieOptions
                    ).status(200).json(
                        {
                            data: "",
                            message: ""
                        }
                    );                   
                } else {
                    return res.status(419).json(
                        {
                            data: "",
                            message: "EXPIRED"
                        }
                    );
                }
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    }
}

const userAuth = {
    signUp: async(req, res, next) => {
        try {
            const user = await User.findOne({where: {webMail: req.body.webMail}})
            if (user) {
                    return res.status(409).json(
                        {
                            data: "",
                            message: "CONFLICT"
                        }
                );
            }
            if (req.body.isAgreed) {
                const user = await User.create(
                    {
                        nickname: req.body.nickname,
                        webMail: req.body.webMail,
                        mainMajorId: req.body.mainMajorId,
                        doubleMajorId: req.body.doubleMajorId,
                        isAgreed: req.body.isAgreed
                    }
                );
                const provider = await Provider.create(
                    {
                        name: req.body.provider,
                        email: req.body.email,
                        userId: user.id
                    }
                )
                console.log(user)
                console.log(provider)
                req.user = user
                return next();
            } else {
                return res.status(401).json(
                    {
                        data: "",
                        message: "UNAUTHORIZED"
                    }
                );
            }
        } catch (error) {
            if (error.message === "Validation error") {
                return res.status(409).json(
                    {
                        data: "",
                        message: "CONFLICT_NICKNAME"
                    }
                )
            }
        }
    },

    signIn: async(req, res) => {
        try {
            if (!req.body.email) {
                return res.status(499).json(
                    {
                        data: req.body,
                        message: "EMAIL_EMPTY"
                    }
                );
            }

            if (!req.body.provider) {
                return res.status(499).json(
                    {
                        data: req.body,
                        message: "PROVIDER_EMPTY"
                    }
                )
            }
            const [webMail, address] = req.body.email.split('@');
            const [ exUser ] = await User.sequelize.query(
                `
                    SELECT users.id AS id, web_mail as webMail, type
                    FROM users 
                    LEFT JOIN providers ON users.id = providers.user_id
                    WHERE web_mail = '${webMail}' or (email = '${req.body.email}' and name = '${req.body.provider}')
                `,
                {type: QueryTypes.SELECT}
            );
            console.log(exUser)
            if (exUser) {
                const payload = {
                    id      : exUser.id,
                    webMail : exUser.webMail,
                    type    : exUser.type
                };
                accessToken = jwt.sign(payload, jwtSecretKey, jwtOptions);
                return res.cookie(
                    'user',
                    accessToken,
                    cookieOptions
                ).status(200).json(
                    {
                        data: "",
                        message: ""
                    }
                );
            } else {
                const userInfo = {'email': req.body.email, 'provider': req.body.provider}
                return res.status(404).json(
                    {
                        data: userInfo,
                        message: "RESOURCE_NOT_FOUND"
                    }
                );
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    data: "",
                    message: error.messagae
                }
            )
        }
    },

    signOut: async(req, res) => {
        console.log(req.cookies['user'])
        return res.clearCookie('user', cookieOptions).status(200).json(
            {
                data: "",
                message: ""
            }
        )
    }
}

const userInfo = {
    getUser: async(req, res) => {
        const user = await User.findOne(
            {
                attributes: [
                    'id',
                    'webMail',
                    'nickName',
                    'phone',
                    'birth',
                ],
                where: { id: req.user.id },
                include: [
                    {
                        model: Provider,
                        attributes: ['name', 'email']
                    },
                    {
                        model: Token,
                        attributes: ['isEmailAuthenticated']
                    },
                    {
                        model: MainMajor
                    },
                    {
                        model: DoubleMajor
                    },
                    { 
                        model: Post,
                        attributes: ['id', 'title']
                    },
                    { 
                        model: Reply,
                        attributes: ['id', 'content'],
                        include: [{model: Post, attributes: ['id', 'title']}]
                    }
                ]
            },
        );
        try {
            return res.status(200).json(
                {
                    data: user,
                    message: ""
                }
            );
        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    },

    updateUser: async(req, res) => {
        const today       = new Date()
        const user        = await User.findOne( { where: { id: req.user.id } } );
        const mainMajor   = await MainMajor.findOne({ where: { id: req.body.mainMajorId } });
        const doubleMajor = await DoubleMajor.findOne( { where: { id: req.body.doubleMajorId } } );
        try {

            if (user.isMainMajorUpdated) {
                return res.status(409).json(
                    {
                        data   : "",
                        message: "CONFLICT_MAIN_MAJOR"
                    }
                );
            }

            if (user.isDoubleMajorUpdated) {
                return res.status(409).json(
                    {
                        data   : "",
                        message: "CONFLICT_DOUBLE_MAJOR"
                    }
                );
            }

            if (!nickname === req.body.nickname) {
                const date = today - user.nicknameUpdatedAt;
                const aDay = 24 * 60 * 60 * 1000

                if (parseInt(date / aDay) >= 30) {
                    user.nickname           = req.body.nicname
                    user.nincknameUpdatedAt = today
                } else {
                    return res.status(400).json(
                        {
                            data    : "",
                            messagae: "INVALID_NICKNAME_TIME"
                        }
                    );
                }
            }


            if (!mainMajor.id === user.mainMajorId) {
                user.isMainMajorUpdated = true
                user.mainMajorId        = mainMajor.id;
            }

            if (!doubleMajor.id === user.doubleMajorId) {
                user.isDoubleMajorUpdated = true
                user.doubleMajorId        = doubleMajor.id;
            }
            
            await user.save();

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            console.log(error);

            if (error.message === 'Validation error') {
                return res.status(409).json(
                    {
                        data: "",
                        message: "CONFLICT_NICKNAME"
                    }
                );
            }
            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    },

    deleteUser: async(req, res) => {
        try {
            await Provider.destroy( { where: { userId: req.user.id }, force: true } );
            await User.destroy( { where: { id: req.user.id }, force: true } );

            return res.clearCookie('user', cookieOptions).status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            console.log(error);

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    }
}

const scrapDirectory = {
    create: async(req, res) => {
        try{
            const directories = await Directory.findAll(
                {
                    attributes: ['name'],
                    where: {userId: req.user.id}
                }
            );
            if (directories) {
                const directoryNames = []
                for (let idx = 0; idx < directories.length; idx++) {
                    directoryNames.push(directories[idx].name)
                }
                if (directoryNames.includes(req.body.name)) {
                    throw error
                }
            }
            if (!req.body.name) {
                throw error
            }
            await Directory.create({name: req.body.name, userId: req.user.id});

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            )
        } catch (error) {
            console.log(error)

            return res.status(409).json(
                {
                    data: "",
                    message: "CONFLICT"
                }
            )
        }
    },

    read: async(req, res) => {
        try{
            directoryInfo = await Directory.findAll(
                {
                    attributes: ['id', 'name'],
                    where: {userId: req.user.id}
                }
            );

            return res.status(200).json(
                {
                    data: directoryInfo,
                    message: ""
                }
            );
        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    },

    update: async(req, res) => {
        try{
            await Directory.update(
                { name: req.body.name },
                { where: { id: req.query.id, userId: req.user.id } }
            );

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            return res.status(409).json(
                {
                    data: "",
                    message: "CONFLICT"
                }
            );
        }
    },

    delete: async(req, res) => {
        try{
            if (!req.query.id) {
                return res.status(422).json(
                    {
                        data: "",
                        message: "QUERY"
                    }
                );
            }
            await Directory.destroy({where: {id: req.user.id }});

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            )
        }
    }
}

const postScrap = {
    create: async(req, res) => {
        try {
            if (req.query.directoryId) {
                var directoryId = req.query.directoryId;
            } else {
                directory = await Directory.findOne(
                    {where: {userId: req.user.id, name: "기타"}}
                );
                var directoryId = directory.id
            }

            if (!req.query.postId) {
                return res.status(422).json(
                    {
                        data: "",
                        message: "QUERY"
                    }
                )
            }
            const post = await Post.findOne({where: {id: req.query.postId}})
            if (!post) {
                return res.status(404).json(
                    {
                        data: "",
                        message: "RESOURCE_NOT_FOUND"
                    }
                )
            }

            const scrap = await Scrap.findOne({where: {postId: post.id}});
            
            if (scrap) {
                return res.status(409).json(
                    {
                        data: "",
                        message: "CONFLICT"
                    }
                )
            }
            await Scrap.create({postId: req.query.postId, directoryId: directoryId});

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    data: "",
                    message: ""
                }
            );
        }
    },

    read: async(req, res) => {
        try {
            // if (!req.query.directoryId) {

            //     return res.status(422).json(
            //         {
            //             data: "",
            //             message: "QUERY"
            //         }
            //     )
            // }
            const scraps = await Directory.findOne(
                {
                    where: { userId: req.user.id },
                    include: [
                        {
                            model: Scrap,
                            attributes: ['id'],
                            include: {model: Post, attributes: ['id', 'title']}
                        }
                    ]
                }
            )
            return res.status(200).json(
                {
                    data: scraps.Scraps,
                    message: ""
                }
            )
        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }        
    },

    update: async(req, res) => {
        try {
            if (!req.query.postId || !req.query.directoryId) {
                return res.status(422).json(
                    {
                        data: "",
                        message: "QUERY"
                    }
                )
            } else {
                await Scrap.update(
                    { directoryId: req.query.directoryId },
                    { where: { postId: req.query.postId }}
                )

                return res.status(200).json(
                    {
                        data: "",
                        message: ""
                    }
                )
            }
        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    },

    delete: async(req, res) => {
        try {
            if (!req.query.id) {
                return res.status(422).json(
                    {
                        data: "",
                        message: "QUERY"
                    }
                );
            }
            await Scrap.destroy({where: {id: req.query.id}});

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            )

        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }
    }
}

module.exports = { emailAuth, userAuth, userInfo, scrapDirectory, postScrap };