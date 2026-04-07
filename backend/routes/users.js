const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get current user profile + balance
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, phone_number, role, business_name, balance, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Top up balance (for testing / admin)
router.post('/topup', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    await db.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;