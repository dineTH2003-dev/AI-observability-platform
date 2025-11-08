const express = require('express');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const modelRoutes = require('./routes/model');
const metricsRoutes = require('./routes/metrics');
const errorHandler = require('./middlewares/errorHandler');
const { requestCounter } = require('./utils/metrics');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

// simple request counter for metrics
app.use((req, res, next) => {
  requestCounter.inc();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/model', modelRoutes);
app.use('/metrics', metricsRoutes);

app.use(errorHandler);

module.exports = app;
