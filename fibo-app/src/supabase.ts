import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Replace the strings below with your ACTUAL Supabase URL and Key!
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rgjogntevmepaqytzyvs.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnam9nbnRldm1lcGFxeXR6eXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzE3MzUsImV4cCI6MjA5MTMwNzczNX0.bBfgfsb8Nw5sQcwqqfLOv-Fmdg5ps1e-GqYGIkzmDo8'
;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});