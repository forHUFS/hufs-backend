const jwt = require('./jwt');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async(req, res, next) => {
        console.log(req.headers.cookie)
        console.log(req.cookies)
        const token = req.cookies['HUFSpace-User'];
        if (!token) {
            return res.status(400).json(
                {
                    code: 400,
                    message: "EMPTY TOKEN"
                }
            );
        }

        const user = await jwt.verify(token);
        // console.log(user)

        if (user === TOKEN_EXPIRED) {
            return res.status(401).json(
                {
                    code: 401,
                    message: "UNAUTHORIZED USER"
                }
            );
        } else if (user === TOKEN_INVALID) {
            return res.status(401).json(
                {
                    code: 401,
                    message: "UNAUTHORIZED USER"
                }
            );
        } else if (user.id === undefined) {
            return res.status(401).json(
                {
                    code: 401,
                    message: "INVALID USER"
                }
            );
        }
        req.id       = user.id;
        req.email    = user.email;
        req.type     = user.type;
        req.nickname = user.nickname;
        next();
    }
}

module.exports = authUtil;