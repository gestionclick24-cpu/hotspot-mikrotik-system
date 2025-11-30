const knex = require('knex');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL || '';

let config;
if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
  config = { client: 'pg', connection: DATABASE_URL };
} else {
  config = { client: 'sqlite3', connection: { filename: './dev.sqlite' }, useNullAsDefault: true };
}
const db = knex(config);
module.exports = db;
