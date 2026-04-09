const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3000';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl,
  },
});
