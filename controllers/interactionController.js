const db = require('../models/db');

const addComment = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    // 1. Grab 'body' from the incoming request
    const { body } = req.body;

    // 2. Check if 'body' exists
    if (!body) {
        return res.status(400).json({ error: "Comment body cannot be empty." });
    }

    try {
        const [result] = await db.query(
            // 3. Insert 'body' into the database
            'INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)',
            [postId, userId, body]
        );
        res.status(201).json({
            message: "Comment added successfully!",
            commentId: result.insertId
        });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ error: "Failed to add comment." });
    }
};


// Paste this right below your addComment function!

const toggleLike = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        // 1. Check if the user already liked this post
        const [existingLikes] = await db.query(
            'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );

        if (existingLikes.length > 0) {
            // 2. If it exists, they are "unliking" it. Delete the row.
            await db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            return res.status(200).json({ message: "Post unliked." });
        } else {
            // 3. If it doesn't exist, they are "liking" it. Insert a row.
            await db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            return res.status(201).json({ message: "Post liked!" });
        }
    } catch (error) {
        console.error("Error toggling like:", error.message);
        res.status(500).json({ error: "Failed to toggle like." });
    }
};

// Export both functions at the very bottom
module.exports = { addComment, toggleLike };