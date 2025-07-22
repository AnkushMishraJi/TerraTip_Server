const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user');
const eventEmitter = require('../events/clients/landTrends/landEventEmitter');
const PasswordService = require('../services/user');

exports.newUserSignUp = catchAsync(async (req, res, next) => {
    const { name, email, phone } = req.body;
    const newUser = await userService.addNewUser(name, email, phone);
    if (!newUser) {
        return res.status(400).json({
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
  let userId = req.params.userId;
  const newProperty = await userService.addUserProperty(userId, coordinates, size, areaType, landType );

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

  let input = {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    size_sqft: size,
    area_type: areaType
  }

  eventEmitter.emit('updatePropertyPrice', input, newProperty._id, userId);

});

exports.generateTokenFromUserDetails = catchAsync(async (req, res, next) => {
  const { phone } = req.body;
  let token = await userService.createUserToken(phone);
  res.status(201).json({
    status: 'success',
    message: 'Token generated successfully',
    data: token.token,
    name: token.name
  });
});

exports.getPortfolio = catchAsync(async (req, res, next) => {
  let userId = req.params.userId;
  const portfolio = await userService.getPortfolioValue(userId);

  res.status(201).json({
    status: 'success',
    message: 'Portfolio value fetched successfully',
    data: {
      portfolio: portfolio || 0,
    },
  });

});

exports.getAllProperties = catchAsync(async (req, res, next) => {
  let userId = req.params.userId;
  const properties = await userService.getAllProperties(userId);

  res.status(201).json({
    status: 'success',
    message: 'Properties data fetched successfully',
    data: {
      properties: properties || [],
    },
  });
});

exports.verifyInvitationToken = catchAsync(async (req, res, next) => {
    const { token } = req.query;

    const result = await PasswordService.verifyToken(token);

    if (!result.valid) {
        return res.status(400).json({
        status: 'fail',
        message: result.message,
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
          message: 'Token is valid',
          email: result.tokenDocs?.email,
          phoneNumber: result.tokenDocs?.phoneNumber,
        },
    });
});
