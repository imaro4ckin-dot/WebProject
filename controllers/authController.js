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


const loginUser = async (req, res) => {
    const {  email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Required fields." });
    }
    try{
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });

        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password or email" });
        }
        res.status(200).json({
            message: "Successfully logged in!",
            userID: user.id,
            username: user.username,

        });

    }catch(error){
        console.error(error);
        return res.status(500).json({ error: "Failed to log in!" });

    }
};
module.exports = { registerUser, loginUser };