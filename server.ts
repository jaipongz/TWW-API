const express = require('express'); // CommonJS syntax for express
const mysql = require('mysql2');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger-output.json');
const { config } = require('dotenv');
const { userRouter } = require('./routes/userRoutes');
const session = require('express-session'); // To manage session
const passport = require('./Middleware/google'); // Import the Google middleware

// Initialize dotenv
config();

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(session({
    secret: process.env.SECRET_PRODUCT, // use a strong secret in production
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(userRouter);

const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
