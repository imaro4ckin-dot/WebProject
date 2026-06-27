const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let pool;

if (process.env.DATABASE_URL) {
    // Local: use DATABASE_URL from .env
    const url = new URL(process.env.DATABASE_URL);
    pool = mysql.createPool({
        host:     url.hostname,
        port:     url.port,
        user:     url.username,
        password: url.password,
        database: url.pathname.slice(1)
    });
} else {
    // Railway: uses individual vars injected automatically
    pool = mysql.createPool({
        host:     process.env.MYSQLHOST,
        port:     process.env.MYSQLPORT,
        user:     process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE
    });
}

module.exports = pool.promise();
