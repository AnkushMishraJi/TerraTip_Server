const express = require('express');

const router = express.Router();
const { addUser, generateToken } = require("../../validation/client/user");
const validate = require('../../middlewares/validate');
const userController = require('../../controllers/user');
const { verifyToken } = require('../../middlewares/auth');
const propertyRouter = require('./property/property');

router.post('/', validate(addUser), userController.newUserSignUp);
router.post('/generateToken', validate(generateToken), userController.generateTokenFromUserDetails);
router.get('/validate', userController.verifyInvitationToken);

router.use(verifyToken);
router.use('/property', propertyRouter);
    
module.exports = router;