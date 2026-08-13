const assert = require('node:assert');
const { test } = require('node:test');
const { signToken, verifyToken } = require('./jwt');

process.env.JWT_SECRET = 'test-secret';

test('signToken then verifyToken returns the original payload fields', () => {
  const token = signToken({ userId: 42, email: 'x@example.com' });
  const payload = verifyToken(token);
  assert.strictEqual(payload.userId, 42);
  assert.strictEqual(payload.email, 'x@example.com');
});

test('verifyToken throws for a tampered token', () => {
  const token = signToken({ userId: 1, email: 'a@example.com' });
  const tampered = token.slice(0, -1) + (token.slice(-1) === 'a' ? 'b' : 'a');
  assert.throws(() => verifyToken(tampered));
});
