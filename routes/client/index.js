const express = require('express');
const authRoutes = require('./auth');
const landTrendRoutes = require('./landTrendRoutes');
const userRoutes = require('./userRoutes');
const router = express.Router();

// Placeholder client route
router.get('/', (req, res) => {
  res.send('Client route');
});

router.use('/auth', authRoutes);
router.use('/land-trend', landTrendRoutes);
router.use('/user', userRoutes);
module.exports = router;

