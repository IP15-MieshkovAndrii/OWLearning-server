const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    courses: {
        type: [{ 
            courseId: String
        }],
        required: true,
        default: []
    },
    role: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User, userSchema};
