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

module.exports = router;
