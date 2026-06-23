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

    console.log('\nAll tables created successfully!');
    process.exit(0);
}

createTables().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
