const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

// Send OTP to phone using Firebase
exports.sendOTP = catchAsync(async (req, res) => {
  const { phone } = req.body;
  const result = await authService.sendOTPService(phone);
  res.status(200).json(result);
});

// Verify OTP and login/register
exports.verifyOTP = catchAsync(async (req, res) => {
  const { phone, idToken } = req.body;
  const { token, user } = await authService.verifyOTPService(phone, idToken);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: 'Authenticated', user });
});

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out' });
};
