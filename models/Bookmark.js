const db = require('./db');

const check = async (postId, userId) => {
    const { rows } = await db.query('SELECT id FROM bookmarks WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    return rows.length > 0;
};

const add = (postId, userId) => db.query('INSERT INTO bookmarks (post_id, user_id) VALUES ($1, $2)', [postId, userId]);

const remove = (postId, userId) => db.query('DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2', [postId, userId]);

const getByUser = async (userId) => {
    const { rows } = await db.query(
        `SELECT posts.id, posts.title, posts.slug, posts.category, posts.image, posts.created_at,
                users.username
         FROM bookmarks
         JOIN posts ON bookmarks.post_id = posts.id
         JOIN users ON posts.user_id = users.id
         WHERE bookmarks.user_id = $1
         ORDER BY bookmarks.created_at DESC`,
        [userId]
    );
    return rows;
};

module.exports = { check, add, remove, getByUser };
