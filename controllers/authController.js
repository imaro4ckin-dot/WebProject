const bcrypt = require('bcrypt');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(username, email, hashedPassword);
        res.status(201).json({ message: "User created successfully!", userId });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ error: "Failed to register user. Email or username might already exist." });
    }
};

module.exports = { registerUser };
