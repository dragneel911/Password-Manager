const pool = require('./pool');

async function createUser({ email, passwordHash, encryptionSalt }) {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, encryption_salt)
     VALUES ($1, $2, $3)
     RETURNING id, email, encryption_salt, created_at`,
    [email, passwordHash, encryptionSalt]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, email, password_hash, encryption_salt, created_at
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, email, encryption_salt, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
