const express = require('express');

const router = express.Router();

const landTrendController = require('../../controllers/landTrend');
const { getTrendVal, getTrendByLocationVal } = require('../../validation/client/landTrend');
const validate = require('../../middlewares/validate');

router.post('/get-trend', validate(getTrendVal), landTrendController.getTrend);
router.get('/get-trend', validate(getTrendByLocationVal), landTrendController.getTrendByLocation);

module.exports = router;


