const jwt       = require('jsonwebtoken');
const secretKey = require('../config/secretKey').secretKey;
const options   = require('../config/secretKey').options;

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;


module.exports = {
    verify: async(token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (error) {
            console.log(error)
            if (error.message === "jwt expired") {
                console.log("expired token");
                return TOKEN_EXPIRED
            } else if (error.message === "invalid token") {
                console.log("invalid token");
                return TOKEN_INVALID
            } else {
                console.log("invalid token");
                return TOKEN_INVALID
            }
        }
        return decoded;
    }
}