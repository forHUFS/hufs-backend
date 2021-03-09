const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorizatoin, process.env.JWT_SECRET);
        return next();
    }

    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(419).json({
                code   : 419,
                message: "Token Expired"
            });
        }

        return res.status(401).json({
            code   : 401,
            message: "Invalid Token"
        });
    }
}