const assert = require('node:assert');
const { test } = require('node:test');
const request = require('supertest');
const app = require('./index');

test('GET /api/health returns status ok', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { status: 'ok' });
});
