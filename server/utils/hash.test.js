const assert = require('node:assert');
const { test } = require('node:test');
const { hashPassword, verifyPassword } = require('./hash');

test('hashPassword produces a hash different from the plaintext', async () => {
  const hash = await hashPassword('correct-horse-battery-staple');
  assert.notStrictEqual(hash, 'correct-horse-battery-staple');
});

test('verifyPassword returns true for the correct password', async () => {
  const hash = await hashPassword('correct-horse-battery-staple');
  const ok = await verifyPassword('correct-horse-battery-staple', hash);
  assert.strictEqual(ok, true);
});

test('verifyPassword returns false for an incorrect password', async () => {
  const hash = await hashPassword('correct-horse-battery-staple');
  const ok = await verifyPassword('wrong-password', hash);
  assert.strictEqual(ok, false);
});
