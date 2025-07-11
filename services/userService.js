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

exports.getPortfolioValue = async (userId) => {
  try {
    const properties = await Property.find({ userId });

    const totalValue = properties.reduce((sum, prop) => {
      return sum + (prop.propertyPrice || 0);
    }, 0);

    return {
      success: true,
      totalValue,
      propertiesCount: properties.length,
    };
  } catch (error) {
    console.error("Error in getPortfolioValue:", error);
    return {
      success: false,
      message: "Error while fetching portfolio value",
    };
  }
};

exports.getAllProperties = async (userId) => {
  try {
    const properties = await Property.find({ userId }, { _id: 1, size: 1, areaType: 1, landType: 1, });
    return properties;
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    return {
      success: false,
      message: "Error while fetching all properties",
    };
  }
}
