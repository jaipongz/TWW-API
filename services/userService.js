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
    const [rows] = await db.query("SELECT * FROM users WHERE user_name = ?", [
      user_name,
    ]);
    if (rows.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { id: user.user_id, user_name: user.user_user_name },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );
    return {
      token
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Invalid username or password");
  }
};

module.exports = {
  register,
  hashPassword,
  login,
};
