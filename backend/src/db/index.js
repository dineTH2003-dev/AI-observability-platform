const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  logger.error('Unexpected PG idle client error', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  query,
  pool
};
