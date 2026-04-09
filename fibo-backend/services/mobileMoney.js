const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/db'); 

// ─────────────────────────────────────────────
// 🚀 THE MOCK SERVICE (For Local Testing)
// ─────────────────────────────────────────────
class MockMoMoService {
  async requestPayment({ amount, phoneNumber }) {
    console.log(`[MOCK] 🟡 Requesting ${amount} UGX from ${phoneNumber}...`);
    // Simulate a 1.5-second network delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log(`[MOCK] ✅ Payment requested successfully.`);
    return `mock-tx-${uuidv4()}`; // Return a fake ID
  }

  async disburse({ amount, phoneNumber }) {
    console.log(`[MOCK] 🟡 Sending ${amount} UGX to ${phoneNumber}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`[MOCK] ✅ Disbursement successful.`);
    return `mock-tx-${uuidv4()}`;
  }

  async getPaymentStatus(referenceId) {
    // Always return successful for testing
    return { status: 'SUCCESSFUL', data: { transaction: { status: 'TS' } } };
  }
}

// ─────────────────────────────────────────────
// 📡 REAL SERVICES (MTN & Airtel)
// ─────────────────────────────────────────────

class MTNMoMoService {
  // ... [Keep your exact MTNMoMoService code here from the previous message] ...
  async requestPayment(payload) { /* real MTN logic */ }
  async disburse(payload) { /* real MTN logic */ }
  async getPaymentStatus(refId) { /* real MTN logic */ }
}

class AirtelMoneyService {
  // ... [Keep your exact AirtelMoneyService code here from the previous message] ...
  async requestPayment(payload) { /* real Airtel logic */ }
  async disburse(payload) { /* real Airtel logic */ }
  async getPaymentStatus(txId) { /* real Airtel logic */ }
}

// ─────────────────────────────────────────────
// ⚙️ UNIFIED SERVICE ENGINE
// ─────────────────────────────────────────────

// Check our .env file to see if we are in testing mode
const isMockMode = process.env.USE_MOCK_MOMO === 'true';

// If in Mock Mode, use the fake service. Otherwise, use the real ones.
const mtn = isMockMode ? new MockMoMoService() : new MTNMoMoService();
const airtel = isMockMode ? new MockMoMoService() : new AirtelMoneyService();

async function processDeposit({ transactionId, provider, amount, phoneNumber }) {
  const service = provider === 'mtn' ? mtn : airtel;
  const requestPayload = { amount, phoneNumber, externalId: transactionId };

  const { data: momoTx, error: insertError } = await supabase.from('mobile_money_transactions')
    .insert({
      transaction_id: transactionId,
      provider,
      operation: 'deposit',
      amount,
      phone_number: phoneNumber,
      status: 'initiated',
      request_payload: requestPayload,
    }).select().single();

  if (insertError) throw new Error("Failed to create MoMo record");

  try {
    const externalRef = await service.requestPayment(requestPayload);

    await supabase.from('mobile_money_transactions')
      .update({ external_reference: externalRef, status: 'pending' })
      .eq('id', momoTx.id);

    // MOCK MODE BONUS: Automatically mark it as completed so you don't have to wait for polling!
    if (isMockMode) {
      await checkAndUpdateStatus(momoTx.id);
    }

    return { success: true, externalRef };
  } catch (error) {
    await supabase.from('mobile_money_transactions').update({ status: 'failed' }).eq('id', momoTx.id);
    throw error;
  }
}

async function processWithdrawal({ transactionId, provider, amount, phoneNumber }) {
  const service = provider === 'mtn' ? mtn : airtel;
  const requestPayload = { amount, phoneNumber, externalId: transactionId };

  const { data: momoTx, error: insertError } = await supabase.from('mobile_money_transactions')
    .insert({
      transaction_id: transactionId,
      provider,
      operation: 'withdraw',
      amount,
      phone_number: phoneNumber,
      status: 'initiated',
      request_payload: requestPayload,
    }).select().single();

  if (insertError) throw new Error("Failed to create MoMo record");

  try {
    const externalRef = await service.disburse(requestPayload);

    await supabase.from('mobile_money_transactions')
      .update({ external_reference: externalRef, status: 'pending' })
      .eq('id', momoTx.id);

    // MOCK MODE BONUS
    if (isMockMode) {
      await checkAndUpdateStatus(momoTx.id);
    }

    return { success: true, externalRef };
  } catch (error) {
    await supabase.from('mobile_money_transactions').update({ status: 'failed' }).eq('id', momoTx.id);
    throw error;
  }
}

async function checkAndUpdateStatus(momoTransactionId) {
  const { data: momoTx } = await supabase.from('mobile_money_transactions').select('*').eq('id', momoTransactionId).single();
  if (!momoTx || !momoTx.external_reference) return;

  const service = momoTx.provider === 'mtn' ? mtn : airtel;
  const statusData = await service.getPaymentStatus(momoTx.external_reference);

  const isSuccess = statusData.status === 'SUCCESSFUL' || statusData?.data?.transaction?.status === 'TS';
  const isFailed = statusData.status === 'FAILED' || statusData?.data?.transaction?.status === 'TF';
  const newStatus = isSuccess ? 'completed' : isFailed ? 'failed' : 'pending';

  await supabase.from('mobile_money_transactions').update({ status: newStatus, updated_at: new Date() }).eq('id', momoTransactionId);

  if (isSuccess || isFailed) {
    await supabase.from('transactions').update({ status: newStatus, completed_at: isSuccess ? new Date() : null }).eq('id', momoTx.transaction_id);
  }
}

module.exports = { processDeposit, processWithdrawal, checkAndUpdateStatus };