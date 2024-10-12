const express = require('express'); // CommonJS syntax for express
const mysql = require('mysql2');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger-output.json');
const { config } = require('dotenv');
const { userRouter } = require('./routes/userRoutes');

// Initialize dotenv
config();

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(userRouter);

const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
