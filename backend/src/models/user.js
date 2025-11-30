const db = require('../db');

async function createUser({ email, passwordHash, provider, providerId }) {
  const insert = { email, provider: provider || 'local', provider_id: providerId || null, password: passwordHash || null };
  const [id] = await db('users').insert(insert).returning('id');
  return id;
}

async function findByEmail(email) {
  return db('users').where({ email }).first();
}

async function findByProvider(provider, providerId) {
  return db('users').where({ provider, provider_id: providerId }).first();
}

module.exports = { createUser, findByEmail, findByProvider };
