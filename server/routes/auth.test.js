const assert = require('node:assert');
const { test, beforeEach, after } = require('node:test');
const request = require('supertest');
const app = require('../index');
const pool = require('../db/pool');
const { truncateAll } = require('../db/testHelpers');

beforeEach(async () => {
  await truncateAll();
});

after(async () => {
  await pool.end();
});

test('POST /api/auth/register creates a user and sets an auth cookie', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'dave@example.com', password: 'correct-horse' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.email, 'dave@example.com');
  assert.ok(res.headers['set-cookie'][0].startsWith('token='));
});

test('POST /api/auth/register rejects a duplicate email with 409', async () => {
  await request(app).post('/api/auth/register').send({ email: 'dup@example.com', password: 'correct-horse' });
  const res = await request(app).post('/api/auth/register').send({ email: 'dup@example.com', password: 'another-pw' });
  assert.strictEqual(res.status, 409);
});

test('POST /api/auth/register rejects a short password with 400', async () => {
  const res = await request(app).post('/api/auth/register').send({ email: 'short@example.com', password: '123' });
  assert.strictEqual(res.status, 400);
});

test('POST /api/auth/login succeeds with correct credentials', async () => {
  await request(app).post('/api/auth/register').send({ email: 'erin@example.com', password: 'correct-horse' });
  const res = await request(app).post('/api/auth/login').send({ email: 'erin@example.com', password: 'correct-horse' });
  assert.strictEqual(res.status, 200);
  assert.ok(res.headers['set-cookie'][0].startsWith('token='));
});

test('POST /api/auth/login rejects a wrong password with 401', async () => {
  await request(app).post('/api/auth/register').send({ email: 'frank@example.com', password: 'correct-horse' });
  const res = await request(app).post('/api/auth/login').send({ email: 'frank@example.com', password: 'wrong-pw' });
  assert.strictEqual(res.status, 401);
});

test('GET /api/auth/me returns 401 without a session', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.strictEqual(res.status, 401);
});

test('GET /api/auth/me returns the current user with a valid session', async () => {
  const agent = request.agent(app);
  await agent.post('/api/auth/register').send({ email: 'gina@example.com', password: 'correct-horse' });
  const res = await agent.get('/api/auth/me');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.email, 'gina@example.com');
});
