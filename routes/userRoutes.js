// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user
/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint creates a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               user_email:
 *                 type: string
 *               user_password:
 *                 type: string
 *               user_profile:
 *                 type: string
 *               user_gmail_id:
 *                 type: string
 *               user_facebook_id:
 *                 type: string
 *               user_type:
 *                 type: string
 *               member_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', (req, res, next) => {
    console.log("Request received at /create");
    next();
}, userController.createUser);

// Route for user registration
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user with username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("Registration request received:", { username, email, password });

    // Call userController.registerUser to handle the registration logic
    userController.registerUser({ username, email, password })
        .then(result => res.status(201).json(result))
        .catch(error => res.status(400).json({ message: error.message }));
});

module.exports = router;
