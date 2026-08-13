const crypto = require('crypto');

const KEY_LENGTH = 32;
const IV_LENGTH = 12;

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function deriveKey(userSaltHex) {
  const masterSecret = process.env.ENCRYPTION_KEY;
  if (!masterSecret) throw new Error('ENCRYPTION_KEY is not set');
  const salt = Buffer.from(userSaltHex, 'hex');
  const ikm = Buffer.from(masterSecret, 'utf8');
  const derived = crypto.hkdfSync('sha256', ikm, salt, 'vault-encryption', KEY_LENGTH);
  return Buffer.from(derived);
}

function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

function decrypt({ ciphertext, iv, authTag }, key) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

module.exports = { generateSalt, deriveKey, encrypt, decrypt };
