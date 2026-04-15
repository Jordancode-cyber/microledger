// src/services/api.ts

// Automatically uses your local .env if it exists, otherwise falls back to your live Vercel backend!
//const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://fibo-backend-7cid.vercel.app/api';

import { supabase } from '../supabase';

// 1. DEPOSIT FLOAT
export const processDeposit = async ({ amount, provider, phoneNumber }: { amount: number, provider: string, phoneNumber: string }) => {
  // Get current user
  const { data: user, error: fetchError } = await supabase.from('users').select('balance').eq('phone_number', phoneNumber).single();
  if (fetchError || !user) throw new Error('Could not find user account.');

  // Add the deposit amount
  const newBalance = Number(user.balance || 0) + amount;

  // Save back to database
  const { error: updateError } = await supabase.from('users').update({ balance: newBalance }).eq('phone_number', phoneNumber);
  if (updateError) throw new Error('Failed to update balance.');

  return { success: true, newBalance };
};

// 2. WITHDRAW FLOAT
export const processWithdrawal = async ({ amount, provider, phoneNumber }: { amount: number, provider: string, phoneNumber: string }) => {
  const { data: user, error: fetchError } = await supabase.from('users').select('balance').eq('phone_number', phoneNumber).single();
  if (fetchError || !user) throw new Error('Could not find user account.');

  if (Number(user.balance) < amount) {
    throw new Error('Insufficient float balance.');
  }

  // Subtract the withdrawal amount
  const newBalance = Number(user.balance || 0) - amount;

  const { error: updateError } = await supabase.from('users').update({ balance: newBalance }).eq('phone_number', phoneNumber);
  if (updateError) throw new Error('Failed to update balance.');

  return { success: true, newBalance };
};

// 3. SEND CHANGE (Deduct Vendor, Add Customer, Auto-Sweep Check)
export const sendMoney = async ({ amount, senderPhone, customerPhone }: { amount: number, senderPhone: string, customerPhone: string }) => {
  
  // A. Check Vendor Account
  const { data: vendor, error: vendorError } = await supabase.from('users').select('balance').eq('phone_number', senderPhone).single();
  if (vendorError || !vendor) throw new Error('Could not find vendor account.');
  if (Number(vendor.balance) < amount) throw new Error('Insufficient float to send this change.');

  // B. Check Customer Account
  const { data: customer, error: customerError } = await supabase.from('users').select('balance').eq('phone_number', customerPhone).single();
  if (customerError || !customer) throw new Error('Customer not found. Make sure they are registered on Fibo.');

  // C. Do the Initial Math
  const newVendorBalance = Number(vendor.balance) - amount;
  let newCustomerBalance = Number(customer.balance) + amount;

  // D. THE AUTO-SWEEP TRIGGER (New Logic!)
  const SWEEP_THRESHOLD = 5000;
  let sweepTriggered = false;
  
  if (newCustomerBalance >= SWEEP_THRESHOLD) {
    // Deduct the 5000 to "send" to their mobile money
    newCustomerBalance -= SWEEP_THRESHOLD; 
    sweepTriggered = true;
  }

  // E. Save both updated balances back to the database
  const { error: updateVendorError } = await supabase.from('users').update({ balance: newVendorBalance }).eq('phone_number', senderPhone);
  if (updateVendorError) throw new Error('Failed to deduct from vendor.');

  const { error: updateCustomerError } = await supabase.from('users').update({ balance: newCustomerBalance }).eq('phone_number', customerPhone);
  if (updateCustomerError) throw new Error('Failed to update customer balance.');

  // F. Print the standard receipt for the change
  await supabase.from('transactions').insert([
    {
      sender_phone: senderPhone,      
      receiver_phone: customerPhone, 
      amount: amount,
      transaction_type: 'send' 
    }
  ]);

  // G. Print the Auto-Sweep receipt if it happened!
  if (sweepTriggered) {
    await supabase.from('transactions').insert([
      {
        sender_phone: customerPhone,
        receiver_phone: 'MTN Mobile Money', // Or Airtel, depending on their setup
        amount: SWEEP_THRESHOLD,
        transaction_type: 'auto_sweep' // Matches the purple icon on your History screen!
      }
    ]);
  }

  return { success: true };
};