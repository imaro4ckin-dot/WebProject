const db = require('./db');

const getByPost = async (postId) => {
    const { rows } = await db.query(
        `SELECT comments.*, users.username, users.profile_pic
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE post_id = $1
         ORDER BY comments.created_at DESC`,
        [postId]
    );
    return rows;
};

const create = async (postId, userId, body) => {
    const { rows } = await db.query(
        'INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING id',
        [postId, userId, body]
    );
    return rows[0].id;
};

const remove = async (commentId, userId) => {
    const { rowCount } = await db.query(
        'DELETE FROM comments WHERE id = $1 AND user_id = $2',
        [commentId, userId]
    );
    return rowCount;
};

module.exports = { getByPost, create, remove };
