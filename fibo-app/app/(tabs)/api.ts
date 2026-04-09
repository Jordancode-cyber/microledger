import Constants from 'expo-constants';

const expoConfig = (Constants.expoConfig || Constants.manifest) as { extra?: { apiUrl?: string } } | undefined;
const apiUrlFromConfig = expoConfig?.extra?.apiUrl;
const debuggerHost = (Constants.manifest as any)?.debuggerHost;
const expoLocalHost = debuggerHost ? `http://${debuggerHost.split(':')[0]}:3000` : undefined;
const API_BASE = apiUrlFromConfig || process.env.EXPO_PUBLIC_API_URL || expoLocalHost || 'http://localhost:3000';

export async function registerUser(payload: {
  userType: string;
  phoneNumber: string;
  pin: string;
  name?: string;
  businessName?: string;
}) {
  const response = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Registration failed');
  }

  return body;
}

export async function loginUser(payload: { phoneNumber: string; pin: string }) {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Login failed');
  }

  return body;
}
