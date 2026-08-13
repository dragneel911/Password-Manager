const assert = require('node:assert');
const { test } = require('node:test');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

process.env.JWT_SECRET = 'test-secret';

test('authenticate calls next and sets req.user for a valid token', () => {
  const token = jwt.sign({ userId: 1, email: 'a@b.com' }, process.env.JWT_SECRET);
  const req = { cookies: { token } };
  let nextCalled = false;
  const res = {};
  authenticate(req, res, () => { nextCalled = true; });
  assert.strictEqual(nextCalled, true);
  assert.deepStrictEqual(req.user, { id: 1, email: 'a@b.com' });
});

test('authenticate responds 401 when no token cookie is present', () => {
  const req = { cookies: {} };
  let statusCode, body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(payload) { body = payload; return this; },
  };
  authenticate(req, res, () => { throw new Error('next should not be called'); });
  assert.strictEqual(statusCode, 401);
  assert.deepStrictEqual(body, { error: 'Not authenticated' });
});

test('authenticate responds 401 for an invalid token', () => {
  const req = { cookies: { token: 'not-a-real-token' } };
  let statusCode, body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(payload) { body = payload; return this; },
  };
  authenticate(req, res, () => { throw new Error('next should not be called'); });
  assert.strictEqual(statusCode, 401);
  assert.deepStrictEqual(body, { error: 'Invalid or expired session' });
});
