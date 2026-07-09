const db = require('./db');

const getByPost = async (postId) => {
    const [rows] = await db.query(
        `SELECT comments.*, users.username, users.profile_pic
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE post_id = ?
         ORDER BY comments.created_at DESC`,
        [postId]
    );
    return rows;
};

const create = async (postId, userId, body) => {
    const [result] = await db.query(
        'INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)',
        [postId, userId, body]
    );
    return result.insertId;
};

const remove = async (commentId, userId) => {
    const [result] = await db.query(
        'DELETE FROM comments WHERE id = ? AND user_id = ?',
        [commentId, userId]
    );
    return result.affectedRows;
};

module.exports = { getByPost, create, remove };
