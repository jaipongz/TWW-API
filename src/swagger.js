const swaggerAutogen = require('swagger-autogen')();
const BASE_URL = process.env.BASE_URL
const doc = {
    info: {
        title: 'TWW-API',
        description: 'No one is as talented as your mother.',
    },
    host: BASE_URL,
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
    './routes/memberRoute.ts',
    './routes/novelRoutes.ts',
    './routes/comunicationRoutes.ts',

];

swaggerAutogen(outputFile, endpointsFiles, doc);
