// setup-db.js
const pool = require('./config/db');

async function createTables() {
    try {
        console.log("Creating tables...");
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone_number VARCHAR(15) UNIQUE NOT NULL,
                pin_hash VARCHAR(255) NOT NULL,
                user_type ENUM('vendor', 'customer') NOT NULL,
                name VARCHAR(255) NOT NULL,
                business_name VARCHAR(255),
                balance DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_type ENUM('send', 'deposit', 'withdraw', 'auto_sweep') NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                from_phone VARCHAR(15),
                to_phone VARCHAR(15) NOT NULL,
                status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Database tables created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating tables:", error.message);
        process.exit(1);
    }
}

createTables();