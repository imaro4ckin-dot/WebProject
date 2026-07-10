const db = require('./db');

const getStats = async () => {
    const { rows } = await db.query(`
        SELECT
            (SELECT COUNT(*) FROM posts)     AS total_posts,
            (SELECT COUNT(*) FROM users)     AS total_users,
            (SELECT COUNT(*) FROM comments)  AS total_comments,
            (SELECT COUNT(*) FROM likes)     AS total_likes,
            (SELECT COUNT(*) FROM bookmarks) AS total_bookmarks
    `);
    return rows[0];
};

const getPostsByCategory = async () => {
    const { rows } = await db.query(`
        SELECT category, COUNT(*) AS count
        FROM posts
        GROUP BY category
        ORDER BY count DESC
    `);
    return rows;
};

const getTopPosts = async (limit = 10) => {
    const { rows } = await db.query(`
        SELECT p.id, p.title, p.slug, p.category, p.views, p.created_at,
               u.username,
               COUNT(DISTINCT l.id)  AS like_count,
               COUNT(DISTINCT c.id)  AS comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN likes    l ON l.post_id = p.id
        LEFT JOIN comments c ON c.post_id = p.id
        GROUP BY p.id, u.username
        ORDER BY p.views DESC, like_count DESC
        LIMIT $1
    `, [limit]);
    return rows;
};

const getMostActiveWriters = async (limit = 5) => {
    const { rows } = await db.query(`
        SELECT u.id, u.username, COUNT(p.id) AS post_count
        FROM users u
        LEFT JOIN posts p ON p.user_id = u.id
        GROUP BY u.id
        ORDER BY post_count DESC
        LIMIT $1
    `, [limit]);
    return rows;
};

const getRecentUsers = async (limit = 15) => {
    const { rows } = await db.query(`
        SELECT id, username, email, created_at, is_banned
        FROM users
        ORDER BY created_at DESC
        LIMIT $1
    `, [limit]);
    return rows;
};

const getRecentComments = async (limit = 20) => {
    const { rows } = await db.query(`
        SELECT c.id, c.body, c.created_at,
               u.username, u.id AS user_id,
               p.title AS post_title, p.slug AS post_slug
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN posts p ON c.post_id = p.id
        ORDER BY c.created_at DESC
        LIMIT $1
    `, [limit]);
    return rows;
};

const deletePost = async (id) => {
    const { rowCount } = await db.query('DELETE FROM posts WHERE id = $1', [id]);
    return rowCount;
};

const deleteComment = async (id) => {
    const { rowCount } = await db.query('DELETE FROM comments WHERE id = $1', [id]);
    return rowCount;
};

const setBanned = async (userId, value) => {
    await db.query('UPDATE users SET is_banned = $1 WHERE id = $2', [value, userId]);
};

module.exports = {
    getStats,
    getPostsByCategory,
    getTopPosts,
    getMostActiveWriters,
    getRecentUsers,
    getRecentComments,
    deletePost,
    deleteComment,
    setBanned,
};
