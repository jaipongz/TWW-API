const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (username, email, password) => {
  try {
    const hashedPassword = await hashPassword(password);

    const user = {
      user_name: username,
      user_email: email,
      user_password: hashedPassword,
    };

    const [result] = await db.query("INSERT INTO users SET ?", user);

    return { id: result.insertId, user_name: username, user_email: email };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("User registration failed");
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const login = async (user_name, password) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_name = ?", [user_name]);

    if (rows.length === 0) {
      return { error: true, code: 401, message: "Invalid credentials" };
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return { error: true, code: 401, message: "Invalid password" };
    }

    const token = jwt.sign(
      { id: user.user_id, user_name: user.user_user_name },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    return { error: false, token };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { error: true, code: 500, message: "An error occurred during login" };
  }
};

const logout = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    await blacklistToken(token);
    res.clearCookie("token");

    req.session = null;

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

const updatePassword = async (email, hashedPassword) => {
  try {
    await db.query("UPDATE users SET user_password = ? WHERE user_email = ?", [
      hashedPassword,
      email,
    ]);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

const checkEmail = async (email) => {
  try {
    const [rows] = await db.query(
      `SELECT user_email FROM users WHERE user_email = ?`,
      [email]
    );

    if (rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error", error);
    
  }
};
const checkUsername = async (userName) => {
  try {
    const [rows] = await db.query(
      `SELECT user_name FROM users WHERE user_name = ?`,
      [userName]
    );

    if (rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error", error);
    
  }
};
module.exports = {
  register,
  hashPassword,
  login,
  logout,
  updatePassword,
  checkEmail,
  checkUsername
};
