const express = require('express'); // CommonJS syntax for express
const mysql = require('mysql2');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger-output.json');
const { config } = require('dotenv');
const { userRouter } = require('./routes/userRoutes');
const { memberRouter } = require('./routes/memberRoute');
const { novelRouter } = require('./routes/novelRoutes');
const { commonRouter } = require('./routes/comunicationRoutes');
const session = require('express-session'); // To manage session
const passport = require('./Middleware/google'); // Import the Google middleware
const path = require('path');
const fs = require('fs');

const customCss = fs.readFileSync('./styles/dark-mode.css', 'utf8');


config();

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(session({
    secret: process.env.SECRET_PRODUCT,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit to 10 MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/storage', express.static(path.join(__dirname, 'src/storage')));
app.use(userRouter);
app.use(memberRouter);
app.use(novelRouter);
app.use(commonRouter);

const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log(`✪✪✪✪✪✪✪✪✪✪✪ ✮ Powered by JaipongZ Industry ✮ ✪✪✪✪✪✪✪✪✪✪✪`);
    console.log(`Api-docs is running on 👉 ${process.env.BASE_URL}api-docs`);
});
