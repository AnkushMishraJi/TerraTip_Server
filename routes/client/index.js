const express = require('express');
const authRoutes = require('./auth');

const router = express.Router();

// Placeholder client route
router.get('/', (req, res) => {
  res.send('Client route');
});

router.use('/auth', authRoutes);

module.exports = router;
