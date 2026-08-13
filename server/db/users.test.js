const assert = require('node:assert');
const { test, beforeEach, after } = require('node:test');
const { truncateAll } = require('./testHelpers');
const { createUser, findUserByEmail, findUserById } = require('./users');
const pool = require('./pool');

beforeEach(async () => {
  await truncateAll();
});

after(async () => {
  await pool.end();
});

test('createUser inserts a user and returns it without the password hash', async () => {
  const user = await createUser({
    email: 'alice@example.com',
    passwordHash: 'hashed-value',
    encryptionSalt: 'deadbeef',
  });
  assert.strictEqual(user.email, 'alice@example.com');
  assert.strictEqual(user.encryption_salt, 'deadbeef');
  assert.ok(user.id);
});

test('findUserByEmail returns the full row including password_hash', async () => {
  await createUser({ email: 'bob@example.com', passwordHash: 'hash123', encryptionSalt: 'salt123' });
  const user = await findUserByEmail('bob@example.com');
  assert.strictEqual(user.email, 'bob@example.com');
  assert.strictEqual(user.password_hash, 'hash123');
});

test('findUserByEmail returns null when no match', async () => {
  const user = await findUserByEmail('nobody@example.com');
  assert.strictEqual(user, null);
});

test('findUserById returns the user', async () => {
  const created = await createUser({ email: 'carol@example.com', passwordHash: 'h', encryptionSalt: 's' });
  const user = await findUserById(created.id);
  assert.strictEqual(user.email, 'carol@example.com');
});
