const jwt = require('jsonwebtoken')

const secretKey = require('../config/secretKey').secretKey;


const authUtil = {
    isSignedIn: async(req, res, next) => {
        const token = req.cookies['HUFSpace-User'];
        if (!token) {
            return res.status(400).json(
                {
                    code: 400,
                    message: "EMPTY_TOKEN"
                }
            );
        }
    
        try {
            req.user = jwt.verify(token, secretKey);
            return next();
        } catch (error) {
            console.log(error)
            if (error.message === "TokenExpiredError") {
                return res.status(419).json(
                    {
                        code: 419,
                        message: "TOKEN_EXPIRED"
                    }
                );
            } else {
                return res.status(401).json(
                    {
                        code: 401,
                        message: "INVALID_TOKEN"
                    }
                );
            }
        }
    },

    isAuthorized: async(req, res, next) => {
        try {
            const type = req.user.type;
    
            if (type === 'admin' || type === 'graduated' || type === 'user') {
                return next();
            } else if (type === 'suspension') {
                return res.status(401).json(
                    {
                        code: 401,
                        message: 'SUSPENDED_USER'
                    }
                );
            } else if (type === 'before') {
                return res.status(401).json(
                    {
                        code: 401,
                        message: 'UNAUTHORIZED_USER'
                    }
                );
            }
        } catch (error) {
            console.log(error)
    
            return res.status(500).json(
                {
                    code: 500,
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
                return res.status(401).json(
                    {
                        code: 401,
                        message: 'UNAUTHORIZED_USER'
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
                return res.status(401).json(
                    {
                        code: 401,
                        message: 'UNAUTHORIZED_USER'
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