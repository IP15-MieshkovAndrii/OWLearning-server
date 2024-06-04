const nodemailer = require('nodemailer');
require("dotenv").config();


const sendMail = async (options) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: false,
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
        logger: true,
        transactionLog: true,
        allowInternalNetworkInterfaces: false
    });
    
    let mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message.replace(/<[^>]+>/g, ''),
        html: options.message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;