const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const passport = require('passport');

const jwtSecretKey    = require('../config/secretKey').jwtSecretKey;
const jwtOptions      = require('../config/secretKey').jwtOptions;
const cookieOptions   = require('../config/secretKey').cookieOptions;
const { transporter } = require('../config/email');

const User  = require('../models/users');
const Token = require('../models/tokens');


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

                    return res.status(200).json(
                        {
                            code: 200,
                            message: token
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
            }
            // ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client at ServerResponse.setHeader 해결 필요
            // 실수로 두 번 호출되거나 body 전송 이후 호출되는 문제 찾아볼 것
            // 정상적으로 메일은 발송 된다.
            transporter.close()
        });
    },

    checkEmail: async(req, res) => {
        try {
            emailToken   = req.query.token
            const tokenTable   = await Token.findOne(
                {
                    where: {emailToken: emailToken}
                }
            );

            const user = await User.update(
                {
                    "type": "user"
                },
                {
                    where: {
                        id: tokenTable.userId
                    }
                }
            );

            return res.redirect('/');

        } catch (error) {
            console.log(error);
        }
    }
}

const userAuth = {
    signUp: async(req, res) => {

        try {
            const newUser = await User.create(
                {
                    email: req.email,
                    name: req.body.name,
                    nickname: req.body.nickname,
                    webMail: req.body.webMail
                }
            )

            const sendEmail = await emailAuth.sendEmail(req, res)

            return res.status(201).json(
                {
                    code: 201,
                    message: "SUCCESS"
                }
            )
        } catch (error) {
            if (error.message === "Validation error") {
                return res.status(400).json(
                    {
                        code: 400,
                        message: "ALREADY_EXISTS"
                    }
                )
            }
        }
    },

    signIn: async(req, res, error, userEmail) => {
        if (error) {
            return res.status(400).json(
                {
                    code: 400,
                    message: error
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
                where: {email: userEmail }
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
                        code: 200,
                        message: "SUCCESS"
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
                code: 200,
                message: "SIGNED_OUT_SUCCESS"
            }
        )
    }
}

const userInfo = {
    updateUser: async(req, res) => {
        user = await User.findOne({where: {id: req.user.id}})
        console.log(user)
        try {
            user.nickname = req.body.nickname

            await user.save()

            return res.status(204).json(
                {
                    code: 204,
                    message: 'USER_INFO_UPDATED'
                }
            )
        } catch (error) {
            // Unique Error
            console.log(error)

            if (error.message === 'Validation error') {
                return res.status(400).json(
                    {
                        code: 400,
                        message: 'ALERDAY_EXISTS'
                    }
                );
            }
            return res.status(500).json(
                {
                    code: 500,
                    message: error.message
                }
            );
        }
    },

    deleteUser: async(req, res) => {
        try {
            await User.destroy({where: {id: req.user.id}})

            return res.status(204).json(
                {
                    code: 204,
                    message: 'DEL_USER_SUCCESS'
                }
            )
        } catch (error) {
            // DB ERROR > 존재하지 않는 경우... 왜? 보안을 위해, postman 통한 공격
            console.log(error)

            return res.status(500).json(
                {
                    code: 500,
                    message: error.message
                }
            )
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

module.exports = { emailAuth, userAuth, socialAuth, userInfo };