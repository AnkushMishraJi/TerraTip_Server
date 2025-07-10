const User = require('../models/User');
const Property = require('../models/Property');
const { createToken } = require('../middlewares/auth');

exports.addNewUser = async (name, email, phone) => {
    const newUser = await User.create({ name, email, phone });
    return newUser || false;
} 

exports.addUserProperty = async (userId, coordinates, size = null, areaType = null, landType = null) => {
    const newProperty = await Property.create({
        userId,
        coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        },
        size,
        areaType,
        landType,
    });

    return newProperty || false;
};

exports.createUserToken = async (phone) => {
  const userDetails = await User.findOne({ phone }, { phone: 1, _id: 1 });

  if (!userDetails) {
    throw new Error('User not found');
  }

  const token = createToken({ userId: userDetails._id });

  return token;
};
