const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { processDeposit, processWithdrawal, checkAndUpdateStatus } = require('./services/mobileMoney');
const supabase = require('./config/db');

// 1. INITIALIZE EXPRESS (This was missing!)
const app = express();

// 2. ADD MIDDLEWARE (Crucial so req.body works)
app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { userType, phoneNumber, pin, name, businessName } = req.body;

  if (!phoneNumber || !pin || pin.length !== 4) {
    return res.status(400).json({ error: 'Phone number and 4-digit PIN are required.' });
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', phoneNumber)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existing) {
      return res.status(409).json({ error: 'A user with this phone number already exists.' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    const payload = {
      phone_number: phoneNumber,
      user_type: userType,
      balance: 0,
    };

    if (name) payload.name = name;
    if (businessName) payload.business_name = businessName;

    const insertWithPinHash = async () => {
      const { data, error } = await supabase.from('users').insert({
        ...payload,
        pin_hash: hashedPin,
      }).select().single();
      return { data, error };
    };

    const insertWithPin = async () => {
      const { data, error } = await supabase.from('users').insert({
        ...payload,
        pin: hashedPin,
      }).select().single();
      return { data, error };
    };

    let inserted;
    let insertError;

    ({ data: inserted, error: insertError } = await insertWithPinHash());

    if (insertError && String(insertError.message).includes('pin_hash')) {
      ({ data: inserted, error: insertError } = await insertWithPin());
    }

    if (insertError) throw insertError;

    res.json({ user: inserted });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: err.message || 'Failed to register user.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) {
    return res.status(400).json({ error: 'Phone number and PIN are required.' });
  }

  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('phone_number', phoneNumber).single();
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid phone number or PIN.' });
    }

    let isValidPin = false;
    if (user.pin_hash) {
      isValidPin = await bcrypt.compare(pin, user.pin_hash);
    } else if (user.pin) {
      if (typeof user.pin === 'string' && user.pin.startsWith('$2')) {
        isValidPin = await bcrypt.compare(pin, user.pin);
      } else {
        isValidPin = pin === user.pin;
      }
    }

    if (!isValidPin) {
      return res.status(401).json({ error: 'Invalid phone number or PIN.' });
    }

    const safeUser = { ...user };
    delete safeUser.pin;
    delete safeUser.pin_hash;

    res.json({ user: safeUser });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message || 'Failed to authenticate user.' });
  }
});

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
let PORT = Number(process.env.PORT) || 3000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Fibo Backend running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
};

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  startServer(PORT);
}

module.exports = app;

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});