const db = require('./db');

const getLatest = async (limit = 6) => {
    const { rows } = await db.query(
        'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC LIMIT $1',
        [limit]
    );
    return rows;
};

const getAll = async (category, q) => {
    let sql = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE 1=1';
    const params = [];
    let i = 1;
    if (category) { sql += ` AND category = $${i++}`; params.push(category); }
    if (q)        { sql += ` AND (title ILIKE $${i} OR content ILIKE $${i++})`; params.push(`%${q}%`); }
    sql += ' ORDER BY posts.created_at DESC';
    const { rows } = await db.query(sql, params);
    return rows;
};

const getById = async (id) => {
    const { rows } = await db.query(
        'SELECT posts.*, users.username, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1',
        [id]
    );
    return rows[0] || null;
};

const incrementViews = (id) => db.query('UPDATE posts SET views = views + 1 WHERE id = $1', [id]);

const create = async (userId, title, slug, content, category, tags, image) => {
    const { rows } = await db.query(
        'INSERT INTO posts (user_id, title, slug, content, category, tags, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [userId, title, slug, content, category, tags || null, image]
    );
    return rows[0].id;
};

const update = async (postId, userId, title, slug, content, category, tags, image) => {
    let sql, params;
    if (image) {
        sql = 'UPDATE posts SET title=$1, slug=$2, content=$3, category=$4, tags=$5, image=$6 WHERE id=$7 AND user_id=$8';
        params = [title, slug, content, category, tags || null, image, postId, userId];
    } else {
        sql = 'UPDATE posts SET title=$1, slug=$2, content=$3, category=$4, tags=$5 WHERE id=$6 AND user_id=$7';
        params = [title, slug, content, category, tags || null, postId, userId];
    }
    const { rowCount } = await db.query(sql, params);
    return rowCount;
};

const remove = async (postId, userId) => {
    const { rowCount } = await db.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [postId, userId]);
    return rowCount;
};

const getByUser = async (userId) => {
    const { rows } = await db.query(
        'SELECT id, title, slug, category, image, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return rows;
};

const getForEdit = async (postId, userId) => {
    const { rows } = await db.query('SELECT * FROM posts WHERE id = $1 AND user_id = $2', [postId, userId]);
    return rows[0] || null;
};

const getBySlug = async (slug) => {
    const { rows } = await db.query(
        'SELECT posts.*, users.username, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.slug = $1',
        [slug]
    );
    return rows[0] || null;
};

const getForEditBySlug = async (slug, userId) => {
    const { rows } = await db.query('SELECT * FROM posts WHERE slug = $1 AND user_id = $2', [slug, userId]);
    return rows[0] || null;
};

module.exports = { getLatest, getAll, getById, getBySlug, incrementViews, create, update, remove, getByUser, getForEdit, getForEditBySlug };
