const express = require('express');
const authRoutes = require('./auth');
const landTrendRoutes = require('./landTrendRoutes');
const router = express.Router();

// Placeholder client route
router.get('/', (req, res) => {
  res.send('Client route');
});

router.use('/auth', authRoutes);
router.use('/land-trend', landTrendRoutes);
module.exports = router;

