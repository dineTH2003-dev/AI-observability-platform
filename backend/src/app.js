const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/auth');
const modelRoutes = require('./routes/model');
const metricsRoutes = require('./routes/metrics');
const hostRoutes = require('./routes/hosts');

const errorHandler = require('./middlewares/errorHandler');
const { requestCounter } = require('./utils/metrics');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(fileUpload());

// metrics counter
app.use((req, res, next) => {
  requestCounter.inc();
  next();
});

// static uploads
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// routes
app.use('/api/hosts', hostRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/model', modelRoutes);
app.use('/metrics', metricsRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
