const db = require('./db');

const getLatest = async (limit = 6) => {
    const [rows] = await db.query(
        'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC LIMIT ?',
        [limit]
    );
    return rows;
};

const getAll = async (category, q) => {
    let sql = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE 1=1';
    const params = [];
    if (category) { sql += ' AND category = ?'; params.push(category); }
    if (q)        { sql += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    sql += ' ORDER BY posts.created_at DESC';
    const [rows] = await db.query(sql, params);
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(
        'SELECT posts.*, users.username, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?',
        [id]
    );
    return rows[0] || null;
};

const incrementViews = (id) => db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);

const create = async (userId, title, slug, content, category, tags, image) => {
    const [result] = await db.query(
        'INSERT INTO posts (user_id, title, slug, content, category, tags, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, title, slug, content, category, tags || null, image]
    );
    return result.insertId;
};

const update = async (postId, userId, title, slug, content, category, tags, image) => {
    let sql, params;
    if (image) {
        sql = 'UPDATE posts SET title=?, slug=?, content=?, category=?, tags=?, image=? WHERE id=? AND user_id=?';
        params = [title, slug, content, category, tags || null, image, postId, userId];
    } else {
        sql = 'UPDATE posts SET title=?, slug=?, content=?, category=?, tags=? WHERE id=? AND user_id=?';
        params = [title, slug, content, category, tags || null, postId, userId];
    }
    const [result] = await db.query(sql, params);
    return result.affectedRows;
};

const remove = async (postId, userId) => {
    const [result] = await db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    return result.affectedRows;
};

const getByUser = async (userId) => {
    const [rows] = await db.query(
        'SELECT id, title, slug, category, image, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows;
};

const getForEdit = async (postId, userId) => {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    return rows[0] || null;
};

module.exports = { getLatest, getAll, getById, incrementViews, create, update, remove, getByUser, getForEdit };
