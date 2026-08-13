const express = require('express');
const authenticate = require('../middleware/authenticate');
const { deriveKey, encrypt, decrypt } = require('../utils/crypto');
const { findUserById } = require('../db/users');
const {
  createEntry,
  findEntriesByUserId,
  findEntryById,
  updateEntry,
  deleteEntry,
} = require('../db/vaultEntries');

const router = express.Router();
router.use(authenticate);

function serializeEntry(entry, plainPassword) {
  return {
    id: entry.id,
    title: entry.title,
    username: entry.username,
    password: plainPassword,
    url: entry.url,
    notes: entry.notes,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    const key = deriveKey(user.encryption_salt);
    const entries = await findEntriesByUserId(req.user.id);
    const decrypted = entries.map((entry) => {
      let plainPassword;
      try {
        plainPassword = decrypt(
          { ciphertext: entry.encrypted_password, iv: entry.iv, authTag: entry.auth_tag },
          key
        );
      } catch (err) {
        plainPassword = null;
      }
      return serializeEntry(entry, plainPassword);
    });
    res.json(decrypted);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, username, password, url, notes } = req.body;
    if (!title || !password) {
      return res.status(400).json({ error: 'title and password are required' });
    }
    const user = await findUserById(req.user.id);
    const key = deriveKey(user.encryption_salt);
    const { ciphertext, iv, authTag } = encrypt(password, key);
    const entry = await createEntry({
      userId: req.user.id,
      title,
      username: username || null,
      encryptedPassword: ciphertext,
      iv,
      authTag,
      url: url || null,
      notes: notes || null,
    });
    res.status(201).json(serializeEntry(entry, password));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    const existing = await findEntryById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    const { title, username, password, url, notes } = req.body;
    if (!title || !password) {
      return res.status(400).json({ error: 'title and password are required' });
    }
    const user = await findUserById(req.user.id);
    const key = deriveKey(user.encryption_salt);
    const { ciphertext, iv, authTag } = encrypt(password, key);
    const entry = await updateEntry(id, {
      title,
      username: username || null,
      encryptedPassword: ciphertext,
      iv,
      authTag,
      url: url || null,
      notes: notes || null,
    });
    res.json(serializeEntry(entry, password));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    const existing = await findEntryById(id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    await deleteEntry(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
