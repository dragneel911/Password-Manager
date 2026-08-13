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

async function registeredAgent(email) {
  const agent = request.agent(app);
  await agent.post('/api/auth/register').send({ email, password: 'correct-horse' });
  return agent;
}

test('POST /api/vault creates an entry and returns the plaintext password', async () => {
  const agent = await registeredAgent('vault1@example.com');
  const res = await agent.post('/api/vault').send({
    title: 'GitHub', username: 'vault1', password: 'super-secret', url: 'https://github.com',
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.password, 'super-secret');
});

test('GET /api/vault lists only the current user entries, decrypted', async () => {
  const agentA = await registeredAgent('vaultA@example.com');
  const agentB = await registeredAgent('vaultB@example.com');
  await agentA.post('/api/vault').send({ title: 'Site A', password: 'pw-a' });
  await agentB.post('/api/vault').send({ title: 'Site B', password: 'pw-b' });

  const resA = await agentA.get('/api/vault');
  assert.strictEqual(resA.body.length, 1);
  assert.strictEqual(resA.body[0].password, 'pw-a');
});

test('PUT /api/vault/:id updates an entry the user owns', async () => {
  const agent = await registeredAgent('vault2@example.com');
  const created = await agent.post('/api/vault').send({ title: 'Old', password: 'old-pw' });
  const res = await agent.put(`/api/vault/${created.body.id}`).send({ title: 'New', password: 'new-pw' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.title, 'New');
  assert.strictEqual(res.body.password, 'new-pw');
});

test("PUT /api/vault/:id returns 404 for another user's entry", async () => {
  const agentA = await registeredAgent('vault3@example.com');
  const agentB = await registeredAgent('vault4@example.com');
  const created = await agentA.post('/api/vault').send({ title: 'A only', password: 'pw' });
  const res = await agentB.put(`/api/vault/${created.body.id}`).send({ title: 'Hijack', password: 'pw2' });
  assert.strictEqual(res.status, 404);
});

test('DELETE /api/vault/:id removes an entry the user owns', async () => {
  const agent = await registeredAgent('vault5@example.com');
  const created = await agent.post('/api/vault').send({ title: 'ToDelete', password: 'pw' });
  const res = await agent.delete(`/api/vault/${created.body.id}`);
  assert.strictEqual(res.status, 204);
  const list = await agent.get('/api/vault');
  assert.strictEqual(list.body.length, 0);
});

test('vault routes return 401 without a session', async () => {
  const res = await request(app).get('/api/vault');
  assert.strictEqual(res.status, 401);
});

test('PUT /api/vault/:id returns 404 for a non-numeric id', async () => {
  const agent = await registeredAgent('vault6@example.com');
  const res = await agent.put('/api/vault/abc').send({ title: 'New', password: 'new-pw' });
  assert.strictEqual(res.status, 404);
});

test('DELETE /api/vault/:id returns 404 for a non-numeric id', async () => {
  const agent = await registeredAgent('vault7@example.com');
  const res = await agent.delete('/api/vault/abc');
  assert.strictEqual(res.status, 404);
});
