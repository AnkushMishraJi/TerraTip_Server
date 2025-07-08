const express = require('express');
const router = express.Router();

const landTrendController = require('../../controllers/landTrendController');

router.post('/get-trend', landTrendController.getTrend);
router.get('/get-trend', landTrendController.getTrendByLocation);

module.exports = router;


