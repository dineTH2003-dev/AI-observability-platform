const pythonService = require('../services/pythonService');
const logger = require('../utils/logger');

async function runModel(req, res, next) {
  try {
    const payload = req.body;
    const result = await pythonService.runModel(payload);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

module.exports = { runModel };
