const { status } = require('http-status');
const ApiError = require('../../utils/ApiError');
const User = require('../../models/User');
const userService = require('../user');

exports.generateLink = async (body) => {
  const { email, phone, name } = body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      status.CONFLICT,
      'User already exists, no need to generate invitation link.'
    );
  }
  const newUser = await User.create({ email, phone, name });
  const expiresAt = `1d`;
  const { token } = await userService.createUserToken(newUser?.email, expiresAt);
  const queryParams = new URLSearchParams({
    ...(name && { name }),
    ...(phone && { phone }),
  });
  return `${process.env.WEB_LINK}/reset-password?token=${token}&email=${email}&${queryParams.toString()}`;
};
