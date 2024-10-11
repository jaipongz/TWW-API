// controllers/userController.js
const userService = require('../services/userService');
exports.createUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_profile, user_gmail_id, user_facebook_id, user_type, member_id } = req.body;

        // Assuming userService.createUser returns the created user object
        const newUser = await userService.createUser({
            user_name,
            user_email,
            user_password,
            user_profile,
            user_gmail_id,
            user_facebook_id,
            user_type,
            member_id
        });

        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (err) {
        console.error('Error creating user:', err); // Log the error details
        res.status(500).json({ message: 'Error creating user', error: err.message }); // Include error message in the response
    }
};

