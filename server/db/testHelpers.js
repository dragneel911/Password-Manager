const pool = require('./pool');

async function truncateAll() {
  await pool.query('TRUNCATE TABLE vault_entries, users RESTART IDENTITY CASCADE');
}

module.exports = { truncateAll };
