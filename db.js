const mysql = require('mysql2/promise'); // Import the promise-based version of MySQL2
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool using the promise-based MySQL2
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Include port if different from the default
    waitForConnections: true,
    connectionLimit: 10, // Set the maximum number of connections
    queueLimit: 0 // No limit on request queue size
});

// Optional: Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

// Export the pool for use in other files
module.exports = pool;
