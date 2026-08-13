const pool = require('./pool');

async function createEntry({ userId, title, username, encryptedPassword, iv, authTag, url, notes }) {
  const result = await pool.query(
    `INSERT INTO vault_entries (user_id, title, username, encrypted_password, iv, auth_tag, url, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, user_id, title, username, encrypted_password, iv, auth_tag, url, notes, created_at, updated_at`,
    [userId, title, username, encryptedPassword, iv, authTag, url, notes]
  );
  return result.rows[0];
}

async function findEntriesByUserId(userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, username, encrypted_password, iv, auth_tag, url, notes, created_at, updated_at
     FROM vault_entries WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function findEntryById(id) {
  const result = await pool.query(
    `SELECT id, user_id, title, username, encrypted_password, iv, auth_tag, url, notes, created_at, updated_at
     FROM vault_entries WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateEntry(id, { title, username, encryptedPassword, iv, authTag, url, notes }) {
  const result = await pool.query(
    `UPDATE vault_entries
     SET title = $1, username = $2, encrypted_password = $3, iv = $4, auth_tag = $5, url = $6, notes = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING id, user_id, title, username, encrypted_password, iv, auth_tag, url, notes, created_at, updated_at`,
    [title, username, encryptedPassword, iv, authTag, url, notes, id]
  );
  return result.rows[0] || null;
}

async function deleteEntry(id) {
  const result = await pool.query(`DELETE FROM vault_entries WHERE id = $1 RETURNING id`, [id]);
  return result.rows.length > 0;
}

module.exports = { createEntry, findEntriesByUserId, findEntryById, updateEntry, deleteEntry };
