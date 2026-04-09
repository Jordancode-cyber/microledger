const db = require('./config/db');

(async () => {
  try {
    console.log('Listing users table columns...');
    const { data: columns, error: colError } = await db
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'users');

    if (colError) {
      console.error('Columns error:', colError);
    } else {
      console.log('Columns:', columns.map(c => c.column_name));
    }

    console.log('\nFetching first 3 users...');
    const { data, error } = await db.from('users').select('*').limit(3);
    if (error) {
      console.error('Users error:', error);
    } else {
      console.log('Users sample:', data);
    }
  } catch (err) {
    console.error('EXCEPTION', err.message);
  }
})();
