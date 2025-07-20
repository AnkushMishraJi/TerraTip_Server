const express = require('express');
const landTrendRoutes = require('./landTrend');
const uploadRoutes = require('./upload');
const userRoutes = require('./user');

const router = express.Router();

// Placeholder client route
router.get('/', (req, res) => {
  res.send('Client route');
});

router.use('/land-trend', landTrendRoutes);
router.use('/upload', uploadRoutes);
router.use('/user', userRoutes);
module.exports = router;

