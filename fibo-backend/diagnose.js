#!/usr/bin/env node

const path = require('path');

console.log('📋 Starting diagnostics...\n');

// Test 1: Load env
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  console.log('✅ ENV loaded:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    USE_MOCK_MOMO: process.env.USE_MOCK_MOMO,
  });
} catch (err) {
  console.error('❌ ENV load failed:', err.message);
  process.exit(1);
}

// Test 2: Load Supabase client
try {
  const supabase = require('./config/db');
  console.log('✅ Supabase client created');
} catch (err) {
  console.error('❌ Supabase client failed:', err.message);
  console.error(err.stack);
  process.exit(1);
}

// Test 3: Load Express
try {
  const express = require('express');
  console.log('✅ Express loaded');
} catch (err) {
  console.error('❌ Express failed:', err.message);
  process.exit(1);
}

// Test 4: Load CORS
try {
  const cors = require('cors');
  console.log('✅ CORS loaded');
} catch (err) {
  console.error('❌ CORS failed:', err.message);
  process.exit(1);
}

// Test 5: Load MobileMoneyService
try {
  const { processDeposit, processWithdrawal, checkAndUpdateStatus } = require('./services/mobileMoney');
  console.log('✅ MobileMoneyService loaded');
} catch (err) {
  console.error('❌ MobileMoneyService failed:', err.message);
  console.error(err.stack);
  process.exit(1);
}

console.log('\n✅ All diagnostics passed! Starting server...\n');

// Now require the actual server
require('./index.js');
