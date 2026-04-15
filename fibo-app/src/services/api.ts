import { supabase } from '../supabase';

// Helper to detect network based on prefix
const getNetworkLabel = (phone: string, isDeposit: boolean) => {
  const mtnPrefixes = ['077', '078', '076', '086', '77', '78', '76', '86'];
  const airtelPrefixes = ['070', '075', '020', '70', '75', '20'];

  const isMTN = mtnPrefixes.some(prefix => String(phone).startsWith(prefix));
  const isAirtel = airtelPrefixes.some(prefix => String(phone).startsWith(prefix));
  
  const network = isMTN ? 'MTN MoMo' : (isAirtel ? 'Airtel Money' : 'Network');
  return isDeposit ? `${network} DEPOSIT` : `${network} WITHDRAW`;
};

// 1. DEPOSIT
export const processDeposit = async ({ amount, phoneNumber }: { amount: number, phoneNumber: string }) => {
  const { data: user } = await supabase.from('users').select('balance').eq('phone_number', phoneNumber).single();
  if (!user) throw new Error('User not found');
  const newBalance = Number(user.balance || 0) + amount;
  await supabase.from('users').update({ balance: newBalance }).eq('phone_number', phoneNumber);
  await supabase.from('transactions').insert([{
    sender_phone: getNetworkLabel(phoneNumber, true),
    receiver_phone: phoneNumber,
    amount: amount,
    transaction_type: 'deposit'
  }]);
  return { success: true };
};

// 2. WITHDRAW
export const processWithdrawal = async ({ amount, phoneNumber }: { amount: number, phoneNumber: string }) => {
  const { data: user } = await supabase.from('users').select('balance').eq('phone_number', phoneNumber).single();
  if (!user || Number(user.balance) < amount) throw new Error('Insufficient balance');
  const newBalance = Number(user.balance) - amount;
  await supabase.from('users').update({ balance: newBalance }).eq('phone_number', phoneNumber);
  await supabase.from('transactions').insert([{
    sender_phone: phoneNumber,
    receiver_phone: getNetworkLabel(phoneNumber, false),
    amount: amount,
    transaction_type: 'withdraw'
  }]);
  return { success: true };
};

// 3. SEND MONEY (The missing member)
export const sendMoney = async ({ amount, senderPhone, customerPhone }: { amount: number, senderPhone: string, customerPhone: string }) => {
  const { data: vendor } = await supabase.from('users').select('balance').eq('phone_number', senderPhone).single();
  const { data: customer } = await supabase.from('users').select('balance').eq('phone_number', customerPhone).single();

  if (!vendor || !customer) throw new Error('Account not found');

  let newVendorBal = Number(vendor.balance) - amount;
  let newCustomerBal = Number(customer.balance) + amount;
  let sweep = false;

  if (newCustomerBal >= 5000) {
    newCustomerBal -= 5000;
    sweep = true;
  }

  await supabase.from('users').update({ balance: newVendorBal }).eq('phone_number', senderPhone);
  await supabase.from('users').update({ balance: newCustomerBal }).eq('phone_number', customerPhone);

  await supabase.from('transactions').insert([{
    sender_phone: senderPhone,
    receiver_phone: customerPhone,
    amount: amount,
    transaction_type: 'send'
  }]);

  if (sweep) {
    await supabase.from('transactions').insert([{
      sender_phone: customerPhone,
      receiver_phone: 'MTN_MOBILE_MONEY',
      amount: 5000,
      transaction_type: 'auto_sweep'
    }]);
  }
  return { success: true };
};