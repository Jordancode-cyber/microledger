const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { processDeposit, processWithdrawal, checkAndUpdateStatus } = require('./services/mobileMoney');
const supabase = require('./config/db');

// 1. INITIALIZE EXPRESS (This was missing!)
const app = express();

// 2. ADD MIDDLEWARE (Crucial so req.body works)
app.use(cors());
app.use(express.json());

// Middleware mock: In reality, use Supabase Auth middleware to verify the user's token
const requireAuth = (req, res, next) => {
  // Example: req.user = await supabase.auth.getUser(req.headers.authorization);
  req.user = { id: 'verified-user-id' }; // Replace with real auth logic
  next();
};

// --- ROUTES ---

// Health check route so you can test if the server is up
app.get('/', (req, res) => {
  res.json({ message: 'Fibo Backend is running normally!' });
});

// Deposit (customer tops up Fibo wallet via MoMo)
app.post('/api/deposit', requireAuth, async (req, res) => {
  const { amount, provider, phoneNumber } = req.body;
  const userId = req.user.id; // Get ID securely from auth, NOT req.body

  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    const { data: tx, error } = await supabase.from('transactions').insert({
      transaction_type: 'deposit',
      amount,
      to_user_id: userId,
      to_phone_number: phoneNumber,
      status: 'pending',
      mobile_money_provider: provider,
      description: `Deposit via ${provider.toUpperCase()}`,
    }).select().single();

    if (error) throw error;

    const result = await processDeposit({
      transactionId: tx.id,
      provider,
      amount,
      phoneNumber,
    });

    res.json({ transactionId: tx.id, ...result });
  } catch (err) {
    console.error("Deposit Error:", err);
    res.status(500).json({ error: "Failed to initiate deposit" });
  }
});

// Withdraw (customer pulls from Fibo to MoMo)
app.post('/api/withdraw', requireAuth, async (req, res) => {
  const { amount, provider, phoneNumber } = req.body;
  const userId = req.user.id; // Secure auth ID

  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    // 1. Verify user has enough balance FIRST
    const { data: user, error: userError } = await supabase
      .from('users') // Assuming your balance is stored on the users table
      .select('balance')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient Fibo balance" });
    }

    // 2. Create the pending withdrawal
    const { data: tx, error: txError } = await supabase.from('transactions').insert({
      transaction_type: 'withdraw',
      amount,
      from_user_id: userId,
      from_phone_number: phoneNumber,
      to_phone_number: phoneNumber,
      status: 'pending',
      mobile_money_provider: provider,
      description: `Withdrawal via ${provider.toUpperCase()}`,
    }).select().single();

    if (txError) throw txError;

    // 3. Process the withdrawal with the provider
    const result = await processWithdrawal({
      transactionId: tx.id,
      provider,
      amount,
      phoneNumber,
    });

    res.json({ transactionId: tx.id, ...result });
  } catch (err) {
    console.error("Withdrawal Error:", err);
    res.status(500).json({ error: "Failed to initiate withdrawal" });
  }
});

// Status check endpoint
app.get('/api/transaction/:momoId/status', requireAuth, async (req, res) => {
  try {
    await checkAndUpdateStatus(req.params.momoId);
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error("Status Check Error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// 3. START THE SERVER (This keeps it from exiting)
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Fibo Backend running on port ${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});