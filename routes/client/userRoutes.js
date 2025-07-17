const express = require('express');

const router = express.Router();

const userController = require('../../controllers/userController');
const { verifyToken } = require('../../middlewares/auth');
const { validateName, validateEmail, validatePhoneNumber, validatePropertyGeoLocation, validatePropertyAreaType, validatePropertySize } = require('../../validation/client/userValidation');

router.post('/', validateName, validateEmail, validatePhoneNumber, userController.newUserSignUp);
router.post('/property', validatePropertyGeoLocation, validatePropertyAreaType, validatePropertySize, verifyToken, userController.addProperty);
router.post('/generateToken', validatePhoneNumber, userController.generateTokenFromUserDetails);
router.get('/portfolio', verifyToken, userController.getPortfolio);
router.get('/', verifyToken, userController.getAllProperties);

module.exports = router;