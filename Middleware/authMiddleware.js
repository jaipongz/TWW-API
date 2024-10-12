const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, return an error response
  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    // Store the decoded user data in the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
