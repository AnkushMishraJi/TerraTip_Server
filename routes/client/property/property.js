const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/user');
const { addPropertyVal, paramsVal } = require('../../../validation/client/property');
const validate = require('../../../middlewares/validate');

router.route('/:userId/').post(validate(addPropertyVal), userController.addProperty).get(validate(paramsVal), userController.getAllProperties);
router.route('/portfolio/:userId').get(validate(paramsVal), userController.getPortfolio);

    
module.exports = router;