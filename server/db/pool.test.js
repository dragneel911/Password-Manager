const assert = require('node:assert');
const { test, after } = require('node:test');
const pool = require('./pool');

after(async () => {
  await pool.end();
});

test('pool can query the test database', async () => {
  const result = await pool.query('SELECT 1 AS value');
  assert.strictEqual(result.rows[0].value, 1);
});

test('users and vault_entries tables exist', async () => {
  const result = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  );
  const tableNames = result.rows.map((row) => row.table_name);
  assert.ok(tableNames.includes('users'));
  assert.ok(tableNames.includes('vault_entries'));
});
