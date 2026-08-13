const assert = require('node:assert');
const { test, beforeEach, after } = require('node:test');
const { truncateAll } = require('./testHelpers');
const { createUser } = require('./users');
const {
  createEntry,
  findEntriesByUserId,
  findEntryById,
  updateEntry,
  deleteEntry,
} = require('./vaultEntries');
const pool = require('./pool');

beforeEach(async () => {
  await truncateAll();
});

after(async () => {
  await pool.end();
});

async function makeUser(email) {
  return createUser({ email, passwordHash: 'h', encryptionSalt: 's' });
}

test('createEntry inserts and returns an entry', async () => {
  const user = await makeUser('vault1@example.com');
  const entry = await createEntry({
    userId: user.id,
    title: 'GitHub',
    username: 'me',
    encryptedPassword: 'cipher',
    iv: 'iv-value',
    authTag: 'tag-value',
    url: 'https://github.com',
    notes: null,
  });
  assert.strictEqual(entry.title, 'GitHub');
  assert.strictEqual(entry.user_id, user.id);
});

test('findEntriesByUserId returns only that user entries', async () => {
  const userA = await makeUser('vaultA@example.com');
  const userB = await makeUser('vaultB@example.com');
  await createEntry({ userId: userA.id, title: 'A', username: null, encryptedPassword: 'c', iv: 'i', authTag: 't', url: null, notes: null });
  await createEntry({ userId: userB.id, title: 'B', username: null, encryptedPassword: 'c', iv: 'i', authTag: 't', url: null, notes: null });
  const entries = await findEntriesByUserId(userA.id);
  assert.strictEqual(entries.length, 1);
  assert.strictEqual(entries[0].title, 'A');
});

test('updateEntry updates the row and returns it', async () => {
  const user = await makeUser('vault2@example.com');
  const created = await createEntry({ userId: user.id, title: 'Old', username: null, encryptedPassword: 'c', iv: 'i', authTag: 't', url: null, notes: null });
  const updated = await updateEntry(created.id, { title: 'New', username: 'u', encryptedPassword: 'c2', iv: 'i2', authTag: 't2', url: null, notes: 'n' });
  assert.strictEqual(updated.title, 'New');
  assert.strictEqual(updated.encrypted_password, 'c2');
});

test('deleteEntry removes the row and returns true', async () => {
  const user = await makeUser('vault3@example.com');
  const created = await createEntry({ userId: user.id, title: 'ToDelete', username: null, encryptedPassword: 'c', iv: 'i', authTag: 't', url: null, notes: null });
  const deleted = await deleteEntry(created.id);
  assert.strictEqual(deleted, true);
  const found = await findEntryById(created.id);
  assert.strictEqual(found, null);
});
