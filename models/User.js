const db = require('./db');

const getById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, username, bio, profile_pic, created_at FROM users WHERE id = ?',
        [id]
    );
    return rows[0] || null;
};

const create = async (username, email, hashedPassword) => {
    const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    return result.insertId;
};

const getByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};

const updateProfile = async (id, bio, profile_pic) => {
    if (profile_pic) {
        await db.query('UPDATE users SET bio = ?, profile_pic = ? WHERE id = ?', [bio || '', profile_pic, id]);
    } else {
        await db.query('UPDATE users SET bio = ? WHERE id = ?', [bio || '', id]);
    }
};

module.exports = { getById, create, getByEmail, updateProfile };
