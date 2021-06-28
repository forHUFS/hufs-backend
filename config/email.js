const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        auth: {
            user: "hufs.web@gmail.com",
            pass: "HufsWeb!234"
        }
    }
);

module.exports = { transporter };