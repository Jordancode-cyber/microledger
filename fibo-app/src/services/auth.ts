import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const expoConfig = Constants.expoConfig || {};

function getSupabaseConfig() {
  const supabaseUrl = String(
    expoConfig.extra?.supabaseUrl ||
      expoConfig.extra?.SUPABASE_URL ||
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      '',
  ).trim();

  const supabaseAnonKey = String(
    expoConfig.extra?.supabaseAnonKey ||
      expoConfig.extra?.SUPABASE_ANON_KEY ||
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      '',
  ).trim();

  return { supabaseUrl, supabaseAnonKey };
}

function getSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.',
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function phoneToEmail(phoneNumber: string) {
  const digits = String(phoneNumber || '')
    .replace(/\D/g, '')
    .replace(/^0+/, '');
  return `${digits}@fibo.app`;
}

export async function registerUser(payload: {
  userType: string;
  phoneNumber: string;
  pin: string;
  name?: string;
  businessName?: string;
}) {
  const email = phoneToEmail(payload.phoneNumber);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp(
    {
      email,
      password: payload.pin,
    },
    {
      data: {
        user_type: payload.userType,
        phone_number: payload.phoneNumber,
        name: payload.name || null,
        business_name: payload.businessName || null,
        balance: 50000,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data?.user) {
    throw new Error('Registration failed. Please try again.');
  }

  return {
    user: {
      ...data.user,
      ...data.user.user_metadata,
    },
  };
}

export async function loginUser(payload: { phoneNumber: string; pin: string }) {
  const email = phoneToEmail(payload.phoneNumber);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: payload.pin,
  });

  if (error) {
    throw error;
  }

  if (!data?.user) {
    throw new Error('Login failed. Please check your phone number and PIN.');
  }

  return {
    user: {
      ...data.user,
      ...data.user.user_metadata,
    },
  };
}

export async function resetPin(phoneNumber: string) {
  const email = phoneToEmail(phoneNumber);
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw error;
  }

  return {
    success: true,
    message: 'Password reset link sent to your email.',
  };
}
