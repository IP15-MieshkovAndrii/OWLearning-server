const fastify = require('fastify')({logger: true})
const fastifyCookie = require("@fastify/cookie");
require("dotenv").config();
const cors = require('@fastify/cors');
const connectDB = require('./utils/db');

fastify.register(fastifyCookie, {
    secret: "my-secret", 
    hook: 'onRequest', 
    parseOptions: {} 
  });


fastify.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    credentials: true 
});



fastify.register(require('./routes/users'), { prefix: '/api' });
fastify.register(require('./routes/courses'), { prefix: '/api' });


const start = async () => {
    try {
        await fastify.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Server is connected with port ${process.env.PORT}`)
            connectDB()
        })
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()


