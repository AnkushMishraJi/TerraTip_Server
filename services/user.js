const { status } = require('http-status');
const User = require('../models/User');
const Property = require('../models/Property');
const { createToken } = require('../middlewares/auth');
const ApiError = require('../utils/ApiError');
const PasswordResetToken = require('../models/PasswordReset');
const bcrypt = require("bcryptjs");

exports.addNewUser = async (name, email, phone) => {
  try {
    const newUser = await User.create({ name, email, phone });
    return newUser;
  } catch (error) {
    // if we want to hide the actual server error and throw a custom error use this
     throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Internal Server error",
      error
    );
  }
    
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
  const userDetails = await User.findOne({ phone }, { phone: 1, _id: 1, name: 1 });

  if (!userDetails) {
    throw new Error('User not found');
  }

  const token = createToken({ userId: userDetails._id });

  return { token, name: userDetails.name };
};

exports.getPortfolioValue = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    const properties = await Property.find({ userId });

    let totalValue = 0;
    let totalArea = 0;

    properties.forEach((prop) => {
      totalValue += Number(prop.propertyPrice) || 0;
      totalArea += Number(prop.size) || 0;
    });

    return {
      success: true,
      totalValue,
      totalArea,
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

exports.verifyToken = async (token) => {
  try {
    const tokenDocs = await PasswordResetToken.find();

    let matchedDoc = null;

    for (const doc of tokenDocs) {
      const isMatch = await bcrypt.compare(token, doc.token);
      if (isMatch) {
        matchedDoc = doc;
        break;
      }
    }

    if (!matchedDoc) {
      return { valid: false, message: 'Invalid or expired token' };
    }

    const now = new Date();
    if (matchedDoc.expiresAt < now) {
      return { valid: false, message: 'Token has expired' };
    }

    return { valid: true, matchedDoc };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false, message: 'Internal server error' };
  }
};
