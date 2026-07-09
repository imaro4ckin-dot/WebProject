// models/Stamp.js
const db = require('./db');

const getAllForUser = async (userId) => {
    // Fetches all available stamps and checks if the specific user has unlocked them
    const [rows] = await db.query(
        `SELECT s.id, s.name, s.description, s.country, s.icon_id, 
                IF(us.id IS NOT NULL, true, false) AS is_unlocked,
                us.earned_at
         FROM stamps s
         LEFT JOIN user_stamps us ON s.id = us.stamp_id AND us.user_id = ?
         ORDER BY s.id ASC`,
        [userId]
    );
    return rows;
};

const awardStamp = async (userId, stampId) => {
    try {
        const [result] = await db.query(
            'INSERT IGNORE INTO user_stamps (user_id, stamp_id) VALUES (?, ?)',
            [userId, stampId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error awarding stamp:", error);
        return false;
    }
};

module.exports = { getAllForUser, awardStamp };