const express = require('express');

const router = express.Router();
const invitationRoutes = require('./invitation');

// Placeholder admin route
router.get('/', (req, res) => {
  res.send('Admin route');
});

router.use('/invitation', invitationRoutes);

module.exports = router;
