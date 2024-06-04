const userController = require("../controllers/user.controller");

const Response = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            _id: {type: 'string'},
            name: {type: 'string',},
            email: {type: 'string'},
            password: {type: 'string'},
            avatar: {type: 'string'},
            courses: {
              type: 'array',
              properties: {
                    courseId:{type: 'string'},
              },
            },
            role: {type: 'string'}
          },

         }
    }
}

const Error = {
    type: 'object',
    properties: {
      errorMessage: { type: 'string' }
    }
}

const registUserOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: userController.registerUser,
}

const loginUserOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: userController.loginUser,
}

const logoutUserOpts = {
    schema: {
      response: {
        200: Response,
        400: Error,
        500: Error
      },
    },
    handler: userController.logoutUser,
}

const getUserOpts = {
  schema: {
      response: {
          200: Response,
          400: Error,
          500: Error
      }
  },
  handler: userController.getUser
}

const updateAccessTokenOpts = {
  schema: {
      response: {
          200: Response,
          400: Error,
          500: Error
      }
  },
  handler: userController.updateAccessToken
};

const updateUserInfoOpts = {
  schema: {
    response: {
      200: Response,
      400: Error,
      500: Error
    },
  },
  handler: userController.updateUserInfo,
}

const updatePasswordOpts = {
  schema: {
    response: {
      200: Response,
      400: Error,
      500: Error
    },
  },
  handler: userController.updatePassword,
}

const updateAvatarOpts = {
  schema: {
    response: {
      200: Response,
      400: Error,
      500: Error
    },
  },
  handler: userController.updateProfilePicture,
}
const getAllUserOpts = {
  handler: userController.getAllUsers,
}

const deleteUserOpts = {
  schema: {
    response: {
      200: Response,
      400: Error,
      500: Error
    },
  },
  handler: userController.deleteUser,
}


function userRoutes(fastify, options, done) {

    fastify.post('/register', registUserOpts);

    fastify.post('/login', loginUserOpts); 

    fastify.get('/logout', logoutUserOpts); 

    fastify.get('/get-user', getUserOpts); 

    fastify.get('/get-all-users', getAllUserOpts); 

    fastify.post('/refresh', updateAccessTokenOpts);

    fastify.put('/update-user-info', updateUserInfoOpts); 

    fastify.put('/update-user-password', updatePasswordOpts); 

    fastify.put('/update-user-avatar', updateAvatarOpts); 

    fastify.delete('/delete-user/:id', deleteUserOpts); 


  
    done()
  }
  
  module.exports = userRoutes