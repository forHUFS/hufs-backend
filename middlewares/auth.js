const jwt = require('jsonwebtoken')

const jwtSecretKey = require('../config/secretKey').jwtSecretKey;


const authUtil = {
    isSignedIn: async(req, res, next) => {
        // const token = req.cookies['user'];
        console.log(req.session.token)
        const token = req.session.token
        if (!token) {
            return res.status(401).json(
                {
                    data: "",
                    message: "UNAUTHORIZED"
                }
            );
        }

        try {
            req.user = jwt.verify(token, jwtSecretKey);
            return next();
        } catch (error) {
            console.log(error)
            // Token 유지 기간을 무한으로 줬기 때문에 ExpiredError는 발생할 가능성이 없어 보인다.
            if (error.message === "TokenExpiredError") {
                return res.status(419).json(
                    {
                        data: "",
                        message: "EXPIRED"
                    }
                );
            } else {
                return res.status(401).json(
                    {
                        data: "",
                        message: "UNAUTHORIZED"
                    }
                );
            }
        }
    },

    isAuthorized: async(req, res, next) => {
        try {
            const type = req.user.type;

            if (type === 'user' || type === 'graduated' || type === 'admin') {
                return next();
            } else if (type === 'suspension') {
                return res.status(403).json(
                    {
                        data: "",
                        message: 'FORBIDDEN_SUSPENSION'
                    }
                );
            } else if (type === 'before') {
                return res.status(403).json(
                    {
                        data: "",
                        message: 'FORBIDDEN_BEFORE'
                    }
                );
            }
        } catch (error) {
            console.log(error)

            return res.status(500).json(
                {
                    data: "",
                    message: error.message
                }
            )
        }
    },

    isAdmin: async(req, res, next) => {
        try {
            const type = req.user.type

            if (type === 'admin') {
                return next();
            } else {
                return res.status(403).json(
                    {
                        code: 403,
                        message: 'FORBIDDEN'
                    }
                );
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {
                    code: 500,
                    message: error.message
                }
            );
        }
    },

    isGraduated: async(req, res, next) => {
        try {
            const type = req.user.type
            if (type === 'admin' || type === 'graduated') {
                return next();
            } else {
                return res.status(403).json(
                    {
                        code: 403,
                        message: 'FORBIDDEN'
                    }
                );
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {
                    code: 500,
                    message: error.message
                }
            )
        }
    }
}

module.exports = { authUtil }