const jwt =require('jsonwebtoken');
const {User} = require('../models/user.model');
const sendMail = require('../utils/sendMail');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcrypt');
require("dotenv").config();

const registerUser = async(req, reply) => {
    try {
        const {name, email, password, role} = req.body;

        const userEmail = await User.findOne({email})
        let newPassword = await bcrypt.hash(password, 10);

        if(userEmail) {
            return reply.code(400).send({ errorMessage: "User already exist!" })
        }

        const user = await User.create({
            name,
            email,
            password: newPassword,
            role
        })
        return sendToken(user, 201, reply);
        
    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }

}

const loginUser = async(req, reply) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return reply.code(400).send({ errorMessage: "Please provide the all fields!" })
        }

        const user = await User.findOne({email})

        if(!user) {
            return reply.code(400).send({ errorMessage: "User doesn't exist!" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
                return reply.code(400).send({ errorMessage: "Please provide the correct information!" })
        }
        
        return sendToken(user, 201, reply);
        
      } catch (error) {
        return reply.code(500).send({ errorMessage: error.message })
      }
}

const logoutUser = async(req, reply) => {
    try{
        reply.setCookie("accessToken", null, {
            path: '/',
            domain: 'localhost',
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).setCookie("refreshToken", null, {
            path: '/',
            domain: 'localhost',
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).code(201).send({
          success: true,
          message: "Log out successful!",
        });
      }catch(error){
        return reply.code(500).send({ errorMessage: error.message })
      }
}

const getUser = async(req, reply) => {
    try {
        const { accessToken } = req.query
        const object = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        const id = object.id;

        const user = await User.findOne({_id: id})

        if(!user) {
            return reply.code(400).send({ errorMessage: "User doesn't exist!" })
        }
      
        reply.code(200).send({
            success: true,
            user,
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return reply.code(401).send({ errorMessage: 'Access token expired' });
        }
        return reply.code(500).send({ errorMessage: error.message })
    }
}

const updateAccessToken = async (req, reply) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return reply.code(400).send({ errorMessage: "Refresh token is required!" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return reply.code(400).send({ errorMessage: "Invalid refresh token!" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return reply.code(404).send({ errorMessage: "User not found!" });
        }

        return sendToken(user, 201, reply);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return reply.code(402).send({ errorMessage: 'Refresh token expired' });
        }
        return reply.code(500).send({ errorMessage: error.message });
    }
};

const updateUserInfo = async (req, reply) => {
    try {
        const { name, email, id } = req.body;

        const newUser = await User.findById(id);
        if (!newUser) {
            return reply.code(404).send({ errorMessage: "User not found!" });
        }

        if (email) {
            const isEmailExist = await User.findOne({ email });
            if (isEmailExist) {
                return reply.code(400).send({ errorMessage: "Email already exists!" });
            }
            newUser.email = email;
        }

        if (name) {
            newUser.name = name;
        }

        await newUser.save();

        reply.code(200).send({
            success: true,
            newUser,
        });
    } catch (error) {
        return reply.code(500).send({ errorMessage: error.message });
    }
};

const updatePassword = async (req, reply) => {
    try {
        const { oldPassword, newPassword, id} = req.body;

        console.log(oldPassword, newPassword, id)

        console.log('12345678987654323456789')

        const user = await User.findById(id);
        if (!user) {
            console.log('------------------------------')
            return reply.code(404).send({ errorMessage: "User not found!" });
        }

        console.log(user.password);

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            console.log('================================')
            return reply.code(400).send({ errorMessage: "Invalid old password!" });
        }

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);;
        }

        await user.save();

        reply.code(200).send({
            success: true,
            user,
        });
    } catch (error) {
        return reply.code(500).send({ errorMessage: error.message });
    }
};

const updateProfilePicture = async (req, reply) => {
    try {
        const { avatarUrl, user } = req.body;

        const id = JSON.parse(user)._id

        console.log('****************************************')
        console.log(id)
        console.log(user)
        const newUser = await User.findById(id);
        if (!newUser) {
            return reply.code(404).send({ errorMessage: "User not found!" });
        }

        if (avatarUrl) {
            newUser.avatar = avatarUrl;
        }
        await newUser.save();

        reply.code(200).send({
            success: true,
            newUser,
        });
    } catch (error) {
        return reply.code(500).send({ errorMessage: error.message });
    }
};

const deleteUser = async (req, reply) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return reply.code(404).send({ errorMessage: "User not found!" });
        }

        await user.deleteOne({id})

        await user.save();

        reply.code(200).send({
            success: true,
            message: 'User deleted successfully!',
        });
    } catch (error) {
        return reply.code(500).send({ errorMessage: error.message });
    }
};

const getAllUsers = async(req, reply) => {
    try {
        const users = await User.find()

        reply.code(200).send({
            success: true,
            users,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUserInfo,
    updateAccessToken,
    updatePassword,
    updateProfilePicture,
    deleteUser,
    getAllUsers
}