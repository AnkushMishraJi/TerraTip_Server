const express = require('express');
const authRoutes = require('./auth');
const landTrendRoutes = require('./landTrendRoutes');
const uploadRoutes = require('./upload');  // ✅ Add this line
const router = express.Router();

// Placeholder client route
router.get('/', (req, res) => {
  res.send('Client route');
});

router.use('/auth', authRoutes);
router.use('/land-trend', landTrendRoutes);
router.use('/upload', uploadRoutes); // ✅ Mount the upload route
module.exports = router;

