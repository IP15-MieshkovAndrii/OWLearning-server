const mongoose = require('mongoose');
const { userSchema } = require('./user.model');

const linkSchema = new mongoose.Schema({
    title: String,
    url: String
});

const commentSchema = new mongoose.Schema({
    user: [userSchema],
    question: String,
    questionReplies: [{user: [userSchema], answer: String}]
});


const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        }
    }]
});

const courseDataSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    text: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    questions: [commentSchema],
    tests: [testSchema],
});


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    courseData: [courseDataSchema]
}, {
    timestamps: true 
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
