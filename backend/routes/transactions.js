const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Send change (vendor only)
router.post('/send', authMiddleware, async (req, res) => {
  const { recipient_phone, recipient_name, amount } = req.body;

  if (!recipient_phone || !amount)
    return res.status(400).json({ error: 'Missing fields' });

  if (amount < 100 || amount > 1000)
    return res.status(400).json({ error: 'Amount must be between 100 and 1000 UGX' });

  const [vendorRows] = await db.query('SELECT * FROM users WHERE id = ? AND role = "vendor"', [req.user.id]);
  if (!vendorRows.length) return res.status(403).json({ error: 'Only vendors can send coins' });

  const vendor = vendorRows[0];
  if (vendor.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  try {
    // Check if recipient is registered
    const [recipientRows] = await db.query('SELECT * FROM users WHERE phone_number = ? AND role = "customer"', [recipient_phone]);

    await db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, vendor.id]);

    if (recipientRows.length) {
      // Registered customer — credit immediately
      await db.query('UPDATE users SET balance = balance + ? WHERE phone_number = ?', [amount, recipient_phone]);
    } else {
      // Unregistered — store as pending
      await db.query(
        'INSERT INTO pending_coins (phone_number, amount, from_vendor_id) VALUES (?, ?, ?)',
        [recipient_phone, amount, vendor.id]
      );
    }

    // Log transaction
    await db.query(
      'INSERT INTO transactions (vendor_id, recipient_phone, recipient_name, amount) VALUES (?, ?, ?, ?)',
      [vendor.id, recipient_phone, recipient_name || null, amount]
    );

    res.json({ success: true, message: 'Coins sent successfully' });
  } catch {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Get transactions (vendor sees their sent; customer sees received)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'vendor') {
      [rows] = await db.query(
        'SELECT * FROM transactions WHERE vendor_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
    } else {
      const [user] = await db.query('SELECT phone_number FROM users WHERE id = ?', [req.user.id]);
      [rows] = await db.query(
        'SELECT * FROM transactions WHERE recipient_phone = ? ORDER BY created_at DESC',
        [user[0].phone_number]
      );
    }
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;