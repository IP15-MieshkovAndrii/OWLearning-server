const courseController = require("../controllers/course.controller");

const Response = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        response: {type: 'string'}
    }
}

const Error = {
    type: 'object',
    properties: {
      errorMessage: { type: 'string' }
    }
}

const uploadCourseOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: courseController.uploadCourse,
}

const editCourseOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: courseController.editCourse,
}

const getSingleCOpts = {
    handler: courseController.getSingleCourse
}

const getAllCoursesOpts = {
    handler: courseController.getAllCourses
}

const addQuestionOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: courseController.addQuestion,
}

const addAnswerOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: courseController.addAnswer,
}

const deleteCourseOpts = {
  handler: courseController.deleteCourse,
}

const getCoursesOpts = {
  handler: courseController.getCourses,
}

function courseRoutes(fastify, options, done) {

    fastify.post('/create-course', uploadCourseOpts);

    fastify.put('/edit-course', editCourseOpts);

    fastify.get('/get-single-course/:id', getSingleCOpts);

    fastify.get('/get-my-courses', getAllCoursesOpts);

    fastify.get('/get-courses', getCoursesOpts);

    fastify.put('/add-question', addQuestionOpts);

    fastify.put('/add-answer', addAnswerOpts);

    fastify.delete('/delete-course', deleteCourseOpts); 

    done()
}
  
module.exports = courseRoutes;