// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Basic Route to check balance
app.get('/api/balance/:phone', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT balance FROM users WHERE phone_number = ?', [req.params.phone]);
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json({ balance: rows[0].balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Fibo Backend running on port ${PORT}`));