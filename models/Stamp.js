const db = require('./db');

const getAllForUser = async (userId) => {
    const { rows } = await db.query(
        `SELECT s.id, s.name, s.description, s.country, s.icon_id,
                (us.id IS NOT NULL) AS is_unlocked,
                us.earned_at
         FROM stamps s
         LEFT JOIN user_stamps us ON s.id = us.stamp_id AND us.user_id = $1
         ORDER BY s.id ASC`,
        [userId]
    );
    return rows;
};

const awardStamp = async (userId, stampId) => {
    try {
        const { rowCount } = await db.query(
            'INSERT INTO user_stamps (user_id, stamp_id) VALUES ($1, $2) ON CONFLICT (user_id, stamp_id) DO NOTHING',
            [userId, stampId]
        );
        return rowCount > 0;
    } catch (error) {
        console.error("Error awarding stamp:", error);
        return false;
    }
};

module.exports = { getAllForUser, awardStamp };
