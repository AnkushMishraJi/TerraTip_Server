const express = require('express');

const router = express.Router();
const { addUserVal, generateTokenVal, resetPasswordVal, userLoginVal } = require("../../validation/client/user");
const validate = require('../../middlewares/validate');
const userController = require('../../controllers/user');
const { verifyToken } = require('../../middlewares/auth');
const propertyRouter = require('./property/property');

router.post('/', validate(addUserVal), userController.newUserSignUp);
router.post('/generateToken', validate(generateTokenVal), userController.generateTokenFromUserDetails);
router.post('/login', validate(userLoginVal), userController.userLogin);
router.use(verifyToken);
router.put('/password-reset', validate(resetPasswordVal), userController.resetPassword);
router.use('/property', propertyRouter);
    
module.exports = router;