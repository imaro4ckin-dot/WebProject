const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL environment variable is not set.');
    process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host:     url.hostname,
  port:     url.port,
  user:     url.username,
  password: url.password,
  database: url.pathname.slice(1)
});

module.exports = pool.promise();
