const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3000';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl,
    supabaseUrl,
    supabaseAnonKey,
  },
});
