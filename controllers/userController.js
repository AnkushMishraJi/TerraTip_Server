const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');

exports.newUserSignUp = catchAsync(async (req, res, next) => {
    const { name, email, phone } = req.body;
    const newUser = await userService.addNewUser(name, email, phone);
    if (!newUser) {
        return res.status(500).json({
            status: 'error',
            message: 'User creation failed',
        });
    }

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        }
    });
});

exports.addProperty = catchAsync(async (req, res, next) => {
  const { coordinates, size, areaType, landType } = req.body;
  const newProperty = await userService.addUserProperty(
    req.userId,
    coordinates,
    size,
    areaType,
    landType
  );

  if (!newProperty) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create property',
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Property added successfully',
    data: {
      property: newProperty,
    },
  });
});

exports.generateTokenFromUserDetails = catchAsync(async (req, res, next) => {
  const { phone } = req.body;
  let token = await userService.createUserToken(phone);
  res.status(201).json({
    status: 'success',
    message: 'Token generated successfully',
    data: token
  });
});