const express = require('express');

const router = express.Router();
const { addUser, generateToken } = require("../../validation/client/user");
const validate = require('../../middlewares/validate');
const userController = require('../../controllers/userController');
const { verifyToken } = require('../../middlewares/auth');
const { validatePropertyGeoLocation, validatePropertyAreaType, validatePropertySize } = require('../../validation/client/userValidation');

router.post('/', validate(addUser), userController.newUserSignUp);
router.post('/generateToken', validate(generateToken), userController.generateTokenFromUserDetails);

router.post('/property', validatePropertyGeoLocation, validatePropertyAreaType, validatePropertySize, verifyToken, userController.addProperty);
router.get('/portfolio', verifyToken, userController.getPortfolio);
router.get('/', verifyToken, userController.getAllProperties);

module.exports = router;