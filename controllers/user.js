const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user');
const eventEmitter = require('../events/clients/landTrends/landEventEmitter');

exports.newUserSignUp = catchAsync(async (req, res) => {
    const { name, email, phone, password } = req.body;
    const newUser = await userService.addNewUser(name, email, phone, password);
    res.status(201).json({
        data: {
            user: newUser,
        }
    });
});

exports.addProperty = catchAsync(async (req, res) => {
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

exports.generateTokenFromUserDetails = catchAsync(async (req, res) => {
  const { email } = req.body;
  let data = await userService.createUserToken(email);
  res.status(201).json({ data });
});

exports.getPortfolio = catchAsync(async (req, res) => {
  let userId = req.params.userId;
  const portfolio = await userService.getPortfolioValue(userId);

  res.status(201).json({
    message: 'Portfolio value fetched successfully',
    data: {
      portfolio: portfolio || 0,
    },
  });

});

exports.getAllProperties = catchAsync(async (req, res) => {
  let userId = req.params.userId;
  const properties = await userService.getAllProperties(userId);

  res.status(201).json({
    message: 'Properties data fetched successfully',
    data: {
      properties: properties || [],
    },
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
    const { email, name, phone } = req.query;
    const { password } = req.body;
    const userId = req.userId;
    const result = await userService.resetPasswordSer(email, password, userId, name, phone);
    res.status(200).json({
        data: result
    });
});

exports.userLogin = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.userLoginSer(email, password);
    res.status(200).json({
        data: result
    });
});

exports.userUpdate = catchAsync(async (req, res) => {
  const { name, email, phone } = req.body;
  let userId = req.userId
  let result = await userService.userUpdateSer(userId, name, email, phone);
  res.status(200).json(result);
});

exports.addPropertyDocument = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { propertyId } = req.body;
  let result = await userService.addPropertyDocumentSer(req.file, userId, propertyId);
  res.status(200).json(result);
});