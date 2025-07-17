const express = require('express');

const router = express.Router();

const landTrendController = require('../../controllers/landTrendController');
const { validateLatitude, validateLongitude, validateSizeSqft, validateAreaType } = require('../../validation/client/landTrendValidation');

router.post('/get-trend', validateLatitude, validateLongitude, validateSizeSqft, validateAreaType, landTrendController.getTrend);
router.get('/get-trend', validateLatitude, validateLongitude, landTrendController.getTrendByLocation);

module.exports = router;


