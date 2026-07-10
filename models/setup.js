const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./db');

async function createTables() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          SERIAL PRIMARY KEY,
            username    VARCHAR(50)  NOT NULL UNIQUE,
            email       VARCHAR(100) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            bio         TEXT,
            profile_pic VARCHAR(255) DEFAULT 'default.jpg',
            is_admin    BOOLEAN DEFAULT FALSE,
            is_banned   BOOLEAN DEFAULT FALSE,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ users');

    await db.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id          SERIAL PRIMARY KEY,
            user_id     INT          NOT NULL,
            title       VARCHAR(255) NOT NULL,
            slug        VARCHAR(255) NOT NULL UNIQUE,
            content     TEXT         NOT NULL,
            category    VARCHAR(50)  NOT NULL,
            tags        VARCHAR(255),
            image       VARCHAR(255),
            views       INT DEFAULT 0,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ posts');

    await db.query(`
        CREATE TABLE IF NOT EXISTS comments (
            id         SERIAL PRIMARY KEY,
            post_id    INT  NOT NULL,
            user_id    INT  NOT NULL,
            body       TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ comments');

    await db.query(`
        CREATE TABLE IF NOT EXISTS likes (
            id         SERIAL PRIMARY KEY,
            post_id    INT NOT NULL,
            user_id    INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ likes');

    await db.query(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id         SERIAL PRIMARY KEY,
            post_id    INT NOT NULL,
            user_id    INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ bookmarks');

    await db.query(`
        CREATE TABLE IF NOT EXISTS stamps (
            id          SERIAL PRIMARY KEY,
            name        VARCHAR(100) NOT NULL,
            description VARCHAR(255) NOT NULL,
            country     VARCHAR(50)  NOT NULL,
            icon_id     VARCHAR(50)  NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ stamps');

    await db.query(`
        CREATE TABLE IF NOT EXISTS user_stamps (
            id         SERIAL PRIMARY KEY,
            user_id    INT NOT NULL,
            stamp_id   INT NOT NULL,
            earned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, stamp_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (stamp_id) REFERENCES stamps(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ user_stamps');

    await db.query(`
        INSERT INTO stamps (id, name, description, country, icon_id) VALUES
        (1, 'Explorer of Spain',    'Awarded for writing about Spain or Barcelona',    'Spain',     'plane'),
        (2, 'Baltic Wanderer',      'Awarded for writing about Lithuania or Vilnius',  'Lithuania', 'plane'),
        (3, 'German Adventurer',    'Awarded for writing about Germany or Heidelberg', 'Germany',   'plane')
        ON CONFLICT (id) DO NOTHING
    `);
    console.log('✓ stamps seeded');

    console.log('\nAll tables created successfully!');
    process.exit(0);
}

createTables().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
