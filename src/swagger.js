const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'TWW-API',
        description: 'No one is as talented as your mother.',
    },
    host: 'localhost:3090',
    schemes: ['http'],
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter 'Bearer' [space] and then your token."
        }
    } 
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
    './routes/userRoutes.ts',
    './routes/memberRoute.ts'

];

swaggerAutogen(outputFile, endpointsFiles, doc);
