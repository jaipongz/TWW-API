const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger-output.json');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
    origin: 'http://your-allowed-origin.com', // Replace with your client's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Use the user routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
