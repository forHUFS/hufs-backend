const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const passport = require('passport');

const jwtSecretKey    = require('../config/secretKey').jwtSecretKey;
const jwtOptions      = require('../config/secretKey').jwtOptions;
const cookieOptions   = require('../config/secretKey').cookieOptions;
const { transporter } = require('../config/email');

const User      = require('../models/users');
const Post      = require('../models/posts');
const Token     = require('../models/tokens');
const Scrap     = require('../models/scraps');
const Directory = require('../models/directories');


const token = crypto.randomBytes(20).toString('hex');

const emailAuth = {
    sendEmail: async(req, res) => {
        const toWhom = req.body.webMail;

        const mailOptions = {
            from: "HUFSpace",
            to: `${toWhom}@hufs.ac.kr`,
            subject: "[ HUFSpace ] 회원가입을 위한 이메일입니다.",
            text: "인증을 위해 아래 URL을 클릭하여 주세요.\n" + `http://localhost:3000/user?token=${token}`
        };

        const result = await transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
                return res.status(error.responseCode).json(
                    {
                        code: error.responseCode,
                        message: error.response
                    }
                )
            } else {
                try {
                    user = await User.findOne({where: {email: req.body.email}});

                    Token.create(
                        {
                            emailToken: token,
                            userId    : user.id
                        }
                    );

                } catch (error) {
                    console.log(error);
                    return res.status(500).json(
                        {
                            data: "",
                            message: error.message
                        }
                    )
                }
            }
            // ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client at ServerResponse.setHeader 해결 필요
            // 실수로 두 번 호출되거나 body 전송 이후 호출되는 문제 찾아볼 것
            // 정상적으로 메일은 발송 된다.
            transporter.close()
        });
    },

    checkEmail: async(req, res, next) => {
        try {
            if (!req.query.token) {
                return next();
            } else {
                const tokenTable = await Token.findOne(
                    {
                        where: {emailToken: emailToken}
                    }
                );

                await User.update(
                    {
                        "type": "user"
                    },
                    {
                        where: {
                            id: tokenTable.userId
                        }
                    }
                );

                return res.status(200).json(
                    {
                        data: "",
                        message: ""
                    }
                );
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            )
        }
    }
}

const userAuth = {
    signUp: async(req, res) => {

        try {
            const user = await User.create(
                {
                    email: req.body.email, // req.email로 변경 예정
                    name: req.body.name,
                    nickname: req.body.nickname,
                    webMail: req.body.webMail
                }
            )

            console.log(user.id)

            await Directory.create({userId: user.id})

            await emailAuth.sendEmail(req, res)

            return res.status(200).json(
                {
                    data: "",
                    message: "SUCCESS"
                }
            )
        } catch (error) {
            if (error.message === "Validation error") {
                return res.status(409).json(
                    {
                        data: "",
                        message: "INVALID"
                    }
                )
            }
        }
    },

    signIn: async(req, res, error, userEmail) => {
        if (error) {
            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            );
        }

        console.log(userEmail)

        if (!userEmail) {
            // return to main page
            return res.redirect('/');
        }

        const exUser = await User.findOne(
            {
                where: {email: userEmail}
            }
        )

        if (exUser) {
            // if (exUser.type === 'suspension') {
            //     return res.status(401).json(
            //         {
            //             code: 401,
            //             message: "SUSPENDED_USER"
            //         }
            //     )
            // }

            req.login(exUser, {session: false}, (error) => {

                const payload = {
                    id      : exUser.id,
                    email   : exUser.email,
                    type    : exUser.type
                };

                accessToken = jwt.sign(payload, jwtSecretKey, jwtOptions);
                console.log(accessToken)
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
            })
        } else {
            req.email = userEmail
            return res.redirect('/user/sign-up');
        }
    },

    signOut: async(req, res) => {
        // req.session.destroy()
        return res.clearCookie('user').status(200).json(
            {
                data: "",
                message: ""
            }
        )
    }
}

const userInfo = {
    getUser: async(req, res) => {
        user = await User.findOne({where: {id: req.user.id}});
        const userInfo = {
            'email': user.email,
            'webMail': `${user.webMail}@hufs.ac.kr`,
            'nickname': user.nickname,
        }
        try {
            return res.status(200).json(
                {
                    data: userInfo,
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
        user = await User.findOne({where: {id: req.user.id}});
        console.log(user)
        try {
            user.nickname = req.body.nickname;

            await user.save();

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            // Unique Error
            console.log(error);

            if (error.message === 'Validation error') {
                return res.status(409).json(
                    {
                        data: "",
                        message: "INVALID"
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
            await User.destroy({where: {id: req.user.id}});

            return res.status(200).json(
                {
                    data: "",
                    message: ""
                }
            );
        } catch (error) {
            // DB ERROR > 존재하지 않는 경우... 왜? 보안을 위해, postman 통한 공격
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

const socialAuth = {
    google: async(req, res) => {
        passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
    },

    googleCallBack: async(req, res) => {
        passport.authenticate('google', (error, user) => {
                userAuth.signIn(req, res, error, user);
            }
        )(req, res);
    },

    kakao: async(req, res) => {
        passport.authenticate('kakao')(req, res);
    },

    kakaoCallBack: async(req, res) => {
        passport.authenticate('kakao', (error, user) => {
                userAuth.signIn(req, res, error, user);
            }
        )(req, res);
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
                    message: "INVALID"
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
                    message: "INVALID"
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
            await Directory.destroy({where: {id: req.query.id}});

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
            scrap = await Scrap.findOne({where: {postId: req.query.postId}});
            
            if (scrap) {
                return res.status(409).json(
                    {
                        data: "",
                        message: "INVALID"
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
            if (!req.query.directoryId) {

                return res.status(422).json(
                    {
                        data: "",
                        message: "QUERY"
                    }
                )
            }
            const scraps = await Scrap.findAll({where: {directoryId: req.query.directoryId}});
            const scrapInfo = [];
            for (let idx = 0; idx < scraps.length; idx++) {
                console.log(scraps[idx].dataValues)
                post = await Post.findOne({where: {id: scraps[idx].dataValues.postId}});
                scrapInfo.push(
                    {
                        'scrapId': scraps[idx].dataValues.id,
                        'postId': post.id,
                        'postTitle': post.title
                    }
                )
            }
            return res.status(200).json(
                {
                    data: scrapInfo,
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

module.exports = { emailAuth, userAuth, socialAuth, userInfo, scrapDirectory, postScrap };