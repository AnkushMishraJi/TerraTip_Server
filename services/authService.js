const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');

exports.sendOTPService = async () =>
  // Firebase client SDK handles OTP, so just return success
  ({ message: 'OTP sent (handled by Firebase client SDK)' });

exports.verifyOTPService = async (phone, idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  if (decodedToken.phone_number !== phone) {
    const err = new Error('Phone number mismatch');
    err.statusCode = 401;
    throw err;
  }
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }
  const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { token, user: { id: user.id, phone: user.phone } };
};
