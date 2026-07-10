const db = require('./db');

const check = async (postId, userId) => {
    const { rows } = await db.query('SELECT id FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    return rows.length > 0;
};

const add = (postId, userId) => db.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);

const remove = (postId, userId) => db.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);

const count = async (postId) => {
    const { rows } = await db.query('SELECT COUNT(*) AS count FROM likes WHERE post_id = $1', [postId]);
    return parseInt(rows[0].count, 10);
};

module.exports = { check, add, remove, count };
