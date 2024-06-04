const Course = require('../models/course.model');
const axios = require('axios');

const uploadCourse = async(req, reply) => {
    try {
        const data = req.body;

        const course = await Course.create(data)

        reply.code(200).send({
            success: true,
            course,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const editCourse = async(req, reply) => {
    try {
        const {id, data} = req.body;

        const course = await Course.findByIdAndUpdate(id, {$set: data}, {new: true})

        reply.code(200).send({
            success: true,
            course,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const getSingleCourse = async(req, reply) => {
    try {
        const course = await Course.findById(req.params.id)

        reply.code(200).send({
            success: true,
            course,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const getAllCourses = async(req, reply) => {
    try {
        const { id } = req.query;
        const courses = await Course.find({teacher_id: id})

        reply.code(200).send({
            success: true,
            courses,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const getCourses = async(req, reply) => {
    try {
        const courses = await Course.find()

        reply.code(200).send({
            success: true,
            courses,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const addQuestion = async(req, reply) => {
    try {
        const {user_id, question, courseId, contentId} = req.body;

        const course = await Course.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return reply.code(400).send({ errorMessage: "Content invalid id!" })
        }

        const couseContent = course?.courseData?.find((item) => item._id.equals(contentId));

        if(!couseContent){
            return next(new ErrorHandler("Invalid content id",400))
        }

        const newQuestion = {
            user_id, 
            question,
            questionReplies: [],
        };

        couseContent.questions.push(newQuestion);

        await course?.save();

        reply.code(200).send({
            success: true,
            course,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const addAnswer = async(req, reply) => {
    try {
        const {user_id, answer, courseId, contentId, questionId} = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const couseContent = course?.courseData?.find((item) => item._id.equals(contentId));

        if (!couseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const question = couseContent?.questions?.find((item) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler("Invalid question id", 400));
        }

        const newAnswer = {
            user_id,
            answer,
        }

        question.questionReplies.push(newAnswer);

        await course?.save();

        if (user._id !== question._id) {
            try {
                await sendMail({
                  email:question.user.email,
                  subject:"Question",
                  message: `Hello ${question.user.name}!\n A new reply has been added to your question in the lesson ${couseContent.title}!`
                })
    
                reply.status(201).send({
                  success:true,
                  message:`Please check your email:- ${user.email} to activate your account`
                })
                
              } catch (error) {
                return reply.code(500).send({ errorMessage: error.message })
                
            }
        }

        reply.code(200).send({
            success: true,
            course,
        });

    } catch (error) {
        return reply.code(400).send({ errorMessage: error.message })
    }
}

const deleteCourse = async (req, reply) => {
    try {
        const { id } = req.query;
        console.log(id)

        const course = await Course.findById(id);

        if (!course) {
            return reply.code(404).send({ errorMessage: "Course not found!" });
        }

        await course.deleteOne({id})

        await course.save();

        reply.code(200).send({
            success: true,
            message:"Course was deleted!",
        });
    } catch (error) {
        return reply.code(500).send({ errorMessage: error.message });
    }
};



module.exports = {
    uploadCourse,
    editCourse,
    getSingleCourse,
    getAllCourses,
    addQuestion,
    addAnswer,
    deleteCourse,
    getCourses
}
