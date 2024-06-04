const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, reply) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRES,
    });

    const accessOptions = {
        path: '/',
        domain: 'localhost',
        expires: new Date(Date.now() + process.env.ACCESS_EXPIRES),
        httpOnly: false,
        sameSite: "Strict",
        secure: true,
    };

    const refreshOptions = {
        path: '/',
        domain: 'localhost',
        expires: new Date(Date.now() + process.env.REFRESH_EXPIRES),
        httpOnly: false,
        sameSite: "Strict",
        secure: true,
    };

    reply.setCookie("accessToken", accessToken, accessOptions);
    reply.setCookie("refreshToken", refreshToken, refreshOptions);

    return reply.code(statusCode).send({
        success: true,
        message: 'User was logged in!',
    });
};

module.exports = sendToken;
