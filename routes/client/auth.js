const express = require('express');

const router = express.Router();

const authController = require('../../controllers/authController');
const validation = require('../../middlewares/validation');

router.post('/send-otp', validation.validateSendOTP, authController.sendOTP);
router.post('/verify-otp', validation.validateVerifyOTP, authController.verifyOTP);
router.post('/logout', authController.logout);

module.exports = router;
