const { status } = require('http-status');
const ApiError = require('../../utils/ApiError');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const PasswordResetToken = require('../../models/PasswordReset');
const User = require('../../models/User');

exports.generateToken = async (body) => {
  try {
    const { email, phoneNumber } = body;

    if ((email && phoneNumber) || (!email && !phoneNumber)) {
      throw new ApiError(
        status.BAD_REQUEST,
        'Exactly one of email or phoneNumber must be provided, not both or none.'
      );
    }

    const existingUser = await User.findOne({
      ...(email ? { email } : { phoneNumber })
    });
    

    if (existingUser) {
      throw new ApiError(
        status.CONFLICT,
        'User already exists, no need to generate invitation link.'
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    // const saltRounds = 10;
    // const hashedToken = await bcrypt.hash(rawToken, saltRounds);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await PasswordResetToken.findOneAndUpdate(
      email ? { email } : { phoneNumber },
      {
        token: rawToken,
        email: email || null,
        phoneNumber: phoneNumber || null,
        expiresAt,
        used: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return rawToken;

  } catch (error) {
    
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      error
    );
  }
};