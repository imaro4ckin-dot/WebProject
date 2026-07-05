const db = require('./db');

const check = async (postId, userId) => {
    const [rows] = await db.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    return rows.length > 0;
};

const add = (postId, userId) => db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);

const remove = (postId, userId) => db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

const count = async (postId) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);
    return rows[0].count;
};

module.exports = { check, add, remove, count };
