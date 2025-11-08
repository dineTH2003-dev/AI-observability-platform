const db = require('../db');

async function findByEmail(email) {
  const res = await db.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

async function createUser(email, passwordHash) {
  const res = await db.query(
    'INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id, email',
    [email, passwordHash]
  );
  return res.rows[0];
}

module.exports = {
  findByEmail,
  createUser
};
