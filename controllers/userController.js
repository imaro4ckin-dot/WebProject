const db = require('../models/db');

const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query(
            'SELECT id, username, bio, profile_pic, created_at FROM users WHERE id = ?',
            [id]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        const [posts] = await db.query(
            'SELECT id, title, slug, category, image, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
            [id]
        );
        res.json({ user: users[0], posts });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile." });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;

    // Only allow a user to edit their own profile
    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: "Not authorized to edit this profile." });
    }

    const { bio } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    try {
        if (profile_pic) {
            await db.query(
                'UPDATE users SET bio = ?, profile_pic = ? WHERE id = ?',
                [bio || '', profile_pic, id]
            );
        } else {
            await db.query(
                'UPDATE users SET bio = ? WHERE id = ?',
                [bio || '', id]
            );
        }
        res.json({ message: "Profile updated successfully!" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile." });
    }
};

const getUserBookmarks = async (req, res) => {
    const { id } = req.params;

    if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: "Not authorized to view these bookmarks." });
    }

    try {
        const [rows] = await db.query(
            `SELECT posts.id, posts.title, posts.slug, posts.category, posts.image, posts.created_at,
                    users.username
             FROM bookmarks
             JOIN posts ON bookmarks.post_id = posts.id
             JOIN users ON posts.user_id = users.id
             WHERE bookmarks.user_id = ?
             ORDER BY bookmarks.created_at DESC`,
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching bookmarks:", err);
        res.status(500).json({ error: "Failed to fetch bookmarks." });
    }
};

module.exports = { getUserProfile, updateUserProfile, getUserBookmarks };
