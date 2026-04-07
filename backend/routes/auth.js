const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { phone_number, pin, role, business_name } = req.body;

  if (!phone_number || !pin || !role)
    return res.status(400).json({ error: 'Missing fields' });

  if (!['vendor', 'customer'].includes(role))
    return res.status(400).json({ error: 'Invalid role' });

  if (role === 'vendor' && !business_name)
    return res.status(400).json({ error: 'Business name required for vendors' });

  try {
    const pin_hash = await bcrypt.hash(pin, 10);
    await db.query(
      'INSERT INTO users (phone_number, pin_hash, role, business_name) VALUES (?, ?, ?, ?)',
      [phone_number, pin_hash, role, business_name || null]
    );

    // If customer, claim any pending coins sent to their number
    if (role === 'customer') {
      const [pending] = await db.query(
        'SELECT SUM(amount) as total FROM pending_coins WHERE phone_number = ? AND claimed = FALSE',
        [phone_number]
      );
      const total = pending[0].total || 0;
      if (total > 0) {
        await db.query('UPDATE users SET balance = balance + ? WHERE phone_number = ?', [total, phone_number]);
        await db.query('UPDATE pending_coins SET claimed = TRUE WHERE phone_number = ?', [phone_number]);
      }
    }

    const [user] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user[0].id, phone_number, role, business_name, balance: user[0].balance } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Phone number already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { phone_number, pin } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(pin, user.pin_hash);
    if (!match) return res.status(401).json({ error: 'Invalid PIN' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, phone_number: user.phone_number, role: user.role, business_name: user.business_name, balance: user.balance }
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;