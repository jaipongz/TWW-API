const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // Ensure you include the port if it's different from the default
});

// Optional: Handle connection errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

// Export the pool to use it in your service
module.exports = pool;
