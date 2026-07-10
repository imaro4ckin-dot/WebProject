const db = require('./db');

const getById = async (id) => {
    const { rows } = await db.query(
        'SELECT id, username, bio, profile_pic, created_at FROM users WHERE id = $1',
        [id]
    );
    return rows[0] || null;
};

const create = async (username, email, hashedPassword) => {
    const { rows } = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        [username, email, hashedPassword]
    );
    return rows[0].id;
};

const getByEmail = async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
};

const updateProfile = async (id, bio, profile_pic) => {
    if (profile_pic) {
        await db.query('UPDATE users SET bio = $1, profile_pic = $2 WHERE id = $3', [bio || '', profile_pic, id]);
    } else {
        await db.query('UPDATE users SET bio = $1 WHERE id = $2', [bio || '', id]);
    }
};

module.exports = { getById, create, getByEmail, updateProfile };
