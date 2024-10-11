const pool = require('../db'); // Adjust the path as necessary

exports.createUser = async (userData) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO users (user_name, user_email, user_password, user_profile, user_gmail_id, user_facebook_id, user_type, member_id) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        pool.query(query, [userData.user_name, userData.user_email, userData.user_password, userData.user_profile, userData.user_gmail_id, userData.user_facebook_id, userData.user_type, userData.member_id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ id: results.insertId, ...userData });
        });
    });
};
