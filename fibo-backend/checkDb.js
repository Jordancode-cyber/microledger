const db = require('./config/db');

(async () => {
  try {
    const { data, error } = await db.from('transactions').select('id').limit(1);
    if (error) {
      console.error('ERROR', error);
      process.exit(1);
    }
    console.log('OK', JSON.stringify(data));
  } catch (err) {
    console.error('EXCEPTION', err.message);
    process.exit(1);
  }
})();
