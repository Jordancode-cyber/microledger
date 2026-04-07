// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. AUTHENTICATION (REGISTER & LOGIN) ---

app.post('/api/auth/register', async (req, res) => {
    const { phone_number, pin, user_type, name, business_name } = req.body;
    try {
        const hashedPin = await bcrypt.hash(pin, 10);
        await db.execute(
            'INSERT INTO users (phone_number, pin_hash, user_type, name, business_name) VALUES (?, ?, ?, ?, ?)',
            [phone_number, hashedPin, user_type, name, business_name || null]
        );
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Phone number already exists" });
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { phone_number, pin } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
        if (users.length === 0) return res.status(404).json({ error: "User not found" });

        const user = users[0];
        const validPin = await bcrypt.compare(pin, user.pin_hash);
        if (!validPin) return res.status(401).json({ error: "Invalid PIN" });

        // Remove pin hash before sending user data to mobile app
        delete user.pin_hash;
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 2. TRANSACTIONS & AUTO-SWEEP ---

app.post('/api/transactions/send', async (req, res) => {
    const { vendor_phone, customer_phone, amount } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verify Vendor has enough float
        const [vendors] = await connection.execute('SELECT balance FROM users WHERE phone_number = ? FOR UPDATE', [vendor_phone]);
        if (vendors.length === 0 || vendors[0].balance < amount) throw new Error("Insufficient vendor float");

        // 2. Verify Customer exists
        const [customers] = await connection.execute('SELECT balance FROM users WHERE phone_number = ? FOR UPDATE', [customer_phone]);
        if (customers.length === 0) throw new Error("Customer not registered in Fibo");

        // 3. Move the money
        await connection.execute('UPDATE users SET balance = balance - ? WHERE phone_number = ?', [amount, vendor_phone]);
        await connection.execute('UPDATE users SET balance = balance + ? WHERE phone_number = ?', [amount, customer_phone]);

        // 4. Record Transaction
        await connection.execute(
            'INSERT INTO transactions (transaction_type, amount, from_phone, to_phone) VALUES (?, ?, ?, ?)',
            ['send', amount, vendor_phone, customer_phone]
        );

        // 5. AUTO SWEEP LOGIC (If customer hits 5000 UGX)
        let sweepTriggered = false;
        const newCustomerBalance = parseFloat(customers[0].balance) + parseFloat(amount);
        
        if (newCustomerBalance >= 5000) {
            sweepTriggered = true;
            // Empty the coin jar
            await connection.execute('UPDATE users SET balance = 0 WHERE phone_number = ?', [customer_phone]);
            // Record the sweep
            await connection.execute(
                'INSERT INTO transactions (transaction_type, amount, from_phone, to_phone) VALUES (?, ?, NULL, ?)',
                ['auto_sweep', newCustomerBalance, customer_phone]
            );
        }

        await connection.commit();
        res.json({ success: true, sweep_triggered: sweepTriggered, message: "Change sent successfully!" });
    } catch (error) {
        await connection.rollback();
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// --- 3. GET BALANCE & HISTORY ---
app.get('/api/user/:phone', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT balance FROM users WHERE phone_number = ?', [req.params.phone]);
        const [transactions] = await db.execute(
            'SELECT * FROM transactions WHERE from_phone = ? OR to_phone = ? ORDER BY created_at DESC LIMIT 10',
            [req.params.phone, req.params.phone]
        );
        res.json({ balance: users[0].balance, transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Fibo Backend running on port ${PORT}`));