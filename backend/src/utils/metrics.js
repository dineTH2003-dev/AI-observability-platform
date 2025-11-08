const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'aio_requests_total',
  help: 'Total number of requests'
});

module.exports = {
  client,
  requestCounter
};
