const db = require('../models/db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    console.log("➡️ 1. Received request at /api/auth/register");
    console.log("📦 2. Request body is:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.log("❌ 3. Shield blocked request: Missing fields.");
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        console.log("🔒 4. Starting password hash...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ 5. Password hashed successfully.");

        console.log("🗄️ 6. Sending query to Railway database...");
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        console.log("✅ 7. Database query successful! ID:", result.insertId);

        res.status(201).json({
            message: "User created successfully!",
            userId: result.insertId
        });
    } catch (error) {
        console.error("❌ 8. Database error caught:", error.message);
        res.status(500).json({ error: "Failed to register user. Email or username might already exist." });
    }
};

module.exports = { registerUser };