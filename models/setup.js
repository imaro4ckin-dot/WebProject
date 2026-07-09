const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./db');

async function createTables() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            username    VARCHAR(50)  NOT NULL UNIQUE,
            email       VARCHAR(100) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            bio         TEXT,
            profile_pic VARCHAR(255) DEFAULT 'default.jpg',
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ users');

    await db.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            user_id     INT          NOT NULL,
            title       VARCHAR(255) NOT NULL,
            slug        VARCHAR(255) NOT NULL UNIQUE,
            content     TEXT         NOT NULL,
            category    ENUM('Nature','City','Culture','Food','Adventure') NOT NULL,
            tags        VARCHAR(255),
            image       VARCHAR(255),
            views       INT DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ posts');

    await db.query(`
        CREATE TABLE IF NOT EXISTS comments (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            post_id    INT  NOT NULL,
            user_id    INT  NOT NULL,
            body       TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ comments');

    await db.query(`
        CREATE TABLE IF NOT EXISTS likes (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            post_id    INT NOT NULL,
            user_id    INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ likes');

    await db.query(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            post_id    INT NOT NULL,
            user_id    INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_bookmark (post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ bookmarks');

    // Moved these inside the function!
    await db.query(`
        CREATE TABLE IF NOT EXISTS stamps (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100) NOT NULL,
            description VARCHAR(255) NOT NULL,
            country     VARCHAR(50)  NOT NULL,
            icon_id     VARCHAR(50)  NOT NULL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ stamps');

    await db.query(`
        CREATE TABLE IF NOT EXISTS user_stamps (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            user_id    INT NOT NULL,
            stamp_id   INT NOT NULL,
            earned_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_stamp (user_id, stamp_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (stamp_id) REFERENCES stamps(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ user_stamps');

    // Seed the three built-in passport stamps (safe to run multiple times thanks to INSERT IGNORE)
    await db.query(`
        INSERT IGNORE INTO stamps (id, name, description, country, icon_id) VALUES
        (1, 'Explorer of Spain',    'Awarded for writing about Spain or Barcelona',    'Spain',     'plane'),
        (2, 'Baltic Wanderer',      'Awarded for writing about Lithuania or Vilnius',  'Lithuania', 'plane'),
        (3, 'German Adventurer',    'Awarded for writing about Germany or Heidelberg', 'Germany',   'plane')
    `);
    console.log('✓ stamps seeded');

    console.log('\nAll tables created successfully!');

    // ── ADMIN SETUP (run once manually after first setup) ──────────────────
    // These columns are NOT created automatically to avoid altering existing data.
    // Connect to your database and run:
    //
    //   ALTER TABLE users ADD COLUMN is_admin  TINYINT(1) DEFAULT 0;
    //   ALTER TABLE users ADD COLUMN is_banned TINYINT(1) DEFAULT 0;
    //   UPDATE users SET is_admin = 1 WHERE username = '<your_username>';
    //
    // After that, log in and visit /admin to access the dashboard.
    // ───────────────────────────────────────────────────────────────────────

    process.exit(0);
}

createTables().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});