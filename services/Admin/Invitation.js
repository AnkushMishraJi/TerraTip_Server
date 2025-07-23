const { status } = require('http-status');
const ApiError = require('../../utils/ApiError');
const User = require('../../models/User');
const userService = require('../../services/user');

exports.generateLink = async (body) => {
  let { email, phone, name } = body;
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new ApiError(
      status.CONFLICT,
      'User already exists, no need to generate invitation link.'
    );
  }
  let newUser = await User.create({ email, phone, name });
  const expiresAt = `1d`    
  let { token } = await userService.createUserToken(newUser?.email, expiresAt);
  console.log("e", email)
  const queryParams = new URLSearchParams({
    ...(name && { name }),
    ...(phone && { phone }),
  });
  return `${process.env.WEB_LINK}/client/user/password-reset?token=${token}&email=${email}&${queryParams.toString()}`;
};