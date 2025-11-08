const axios = require('axios');
const logger = require('../utils/logger');

const PY_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

async function runModel(payload) {
  const res = await axios.post(`${PY_URL}/run-model`, payload, { timeout: 120000 });
  return res.data;
}

const { spawn } = require('child_process');
const path = require('path');

function runModelLocal(args = []) {
  return new Promise((resolve, reject) => {
    const py = spawn('python', [path.join(__dirname, '../../python-service/model_stub.py'), ...args]);

    let out = '';
    let err = '';

    py.stdout.on('data', (d) => out += d.toString());
    py.stderr.on('data', (d) => err += d.toString());

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`python exited ${code}: ${err}`));
      }
      try {
        const parsed = JSON.parse(out);
        resolve(parsed);
      } catch (e) {
        resolve(out);
      }
    });
  });
}

module.exports = { runModel, runModelLocal };
