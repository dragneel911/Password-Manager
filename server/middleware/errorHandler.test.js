const assert = require('node:assert');
const { test } = require('node:test');
const errorHandler = require('./errorHandler');

test('errorHandler responds with the error status and message when status is set', () => {
  const err = Object.assign(new Error('Email already registered'), { status: 409 });
  let statusCode, body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(payload) { body = payload; return this; },
  };
  errorHandler(err, {}, res, () => {});
  assert.strictEqual(statusCode, 409);
  assert.deepStrictEqual(body, { error: 'Email already registered' });
});

test('errorHandler hides the message and defaults to 500 for unexpected errors', () => {
  const err = new Error('some internal detail');
  let statusCode, body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(payload) { body = payload; return this; },
  };
  errorHandler(err, {}, res, () => {});
  assert.strictEqual(statusCode, 500);
  assert.deepStrictEqual(body, { error: 'Internal server error' });
});
