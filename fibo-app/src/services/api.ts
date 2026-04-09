// src/services/api.ts

// Automatically uses your local .env if it exists, otherwise falls back to your live Vercel backend!
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://fibo-backend-7cid.vercel.app/api';

export async function processDeposit(payload: {
  amount: number;
  provider: string; // 'mtn' or 'airtel'
  phoneNumber: string;
}) {
  const response = await fetch(`${API_BASE}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Deposit failed');
  }

  return body;
}

export async function processWithdrawal(payload: {
  amount: number;
  provider: string;
  phoneNumber: string;
}) {
  const response = await fetch(`${API_BASE}/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Withdrawal failed');
  }

  return body;
}

export async function sendMoney(payload: {
  amount: number;
  phoneNumber: string;
}) {
  const response = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Send failed');
  }

  return body;
}