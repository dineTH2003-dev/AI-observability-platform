const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal error' });
};
