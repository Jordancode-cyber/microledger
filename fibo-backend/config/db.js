// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to Aiven Cloud MySQL!');
        connection.release();
    })
    .catch(err => console.error('❌ Database connection failed:', err.message));

module.exports = pool;