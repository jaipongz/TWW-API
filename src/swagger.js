// src/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'Description of the API',
    },
    host: 'localhost:3090',  // Use the correct port
    schemes: ['http'],       // Adjust if using https
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/userRoutes.js'];  // Ensure this points to your route files

swaggerAutogen(outputFile, endpointsFiles, doc);
