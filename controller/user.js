const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const passport = require('passport');


const secretKey       = require('../config/secretKey').secretKey;
const options         = require('../config/secretKey').options;
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

const signUp = {
    createUser: async(req, res) => {
        try {
            const newUser = await User.create(
                {
                    email: req.body.email,
                    name: req.body.name,
                    nickname: req.body.nickname,
                    webMail: req.body.webMail
                }
            )
        
            const sendEmail = await emailAuth.sendEmail(req, res)
        
            return res.status(200).json(
                {
                    code: 200,
                    message: "SUCCESS"
                }
            )
        } catch (error) {
            if (error.message === "Validation error") {
                return res.status(400).json(
                    {
                        code: 400,
                        message: "ALREADY EXISTS"
                    }
                )
            }
        }
    }
}

const signIn  = async(req, res, err, user) => {
    if (err) {
        return res.status(400).json(
            {
                code: 400,
                message: err
            }
        );
    }
    
    if (!user) {
        // return to main page
        return res.redirect('/');
    }

    const exUser = await User.findOne(
        {
            where: {email: user.email}
        }
    )

    if (exUser) {
        req.login(exUser, {session: false}, (err) => {
            const payload = {
                id      : exUser.id,
                email   : exUser.email,
                type    : exUser.type
            };

            accessToken = jwt.sign(payload, secretKey, options);
            console.log(accessToken)
            return res.cookie(
                'HUFSpace-User',
                accessToken,
                {
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true,
                    secure: false
                }
            ).status(200).json(
                {
                    code: 200,
                    message: "SUCCESS"
                }
            );
        })
    } else {
        return res.redirect('/user/sign-up');
    }
}

const socialAuth = {
    google: async(req, res) => {
        passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
    },

    googleCallBack: async(req, res) => {
        passport.authenticate('google', (err, user) => {
                signIn(req, res, err, user);
            }
        )(req, res);
    },

    kakao: async(req, res) => {
        passport.authenticate('kakao')(req, res);
    },

    kakaoCallBack: async(req, res) => {
        passport.authenticate('kakao', (error, user) => {
                signIn(req, res, error, user);
            }
        )(req, res);
    }
}

module.exports = { emailAuth, socialAuth, signUp };