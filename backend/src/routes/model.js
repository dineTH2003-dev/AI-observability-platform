const express = require('express');
const router = express.Router();
const { runModel } = require('../controllers/modelController');
const auth = require('../middlewares/authMiddleware');

router.post('/run', auth, runModel);

module.exports = router;
