const assert = require('node:assert');
const { test } = require('node:test');
const { generateSalt, deriveKey, encrypt, decrypt } = require('./crypto');

process.env.ENCRYPTION_KEY = 'test-master-secret-please-ignore';

test('encrypt then decrypt returns the original plaintext', () => {
  const key = deriveKey(generateSalt());
  const { ciphertext, iv, authTag } = encrypt('my-secret-password', key);
  const plaintext = decrypt({ ciphertext, iv, authTag }, key);
  assert.strictEqual(plaintext, 'my-secret-password');
});

test('two encryptions of the same plaintext use different IVs and ciphertexts', () => {
  const key = deriveKey(generateSalt());
  const first = encrypt('same-password', key);
  const second = encrypt('same-password', key);
  assert.notStrictEqual(first.iv, second.iv);
  assert.notStrictEqual(first.ciphertext, second.ciphertext);
});

test('decrypt throws if the ciphertext has been tampered with', () => {
  const key = deriveKey(generateSalt());
  const { ciphertext, iv, authTag } = encrypt('tamper-me', key);
  const tampered = Buffer.from(ciphertext, 'base64');
  tampered[0] ^= 0xff;
  assert.throws(() => decrypt({ ciphertext: tampered.toString('base64'), iv, authTag }, key));
});

test('deriveKey produces different keys for different salts', () => {
  const keyA = deriveKey(generateSalt());
  const keyB = deriveKey(generateSalt());
  assert.notStrictEqual(keyA.toString('hex'), keyB.toString('hex'));
});
