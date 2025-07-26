const { status } = require('http-status');
const User = require('../models/User');
const Property = require('../models/Property');
const { createToken } = require('../middlewares/auth');
const ApiError = require('../utils/ApiError');
const bcrypt = require("bcryptjs");
const { handleUploadAndGetUrl } = require('./upload');

exports.addNewUser = async (name, email, phone, password) => {
  return await User.create({ name, email, phone, password });
};

exports.addUserProperty = async (
  userId,
  coordinates,
  size = null,
  areaType = null,
  landType = null
) => {
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

exports.createUserToken = async (email, expiresAt) => {
  const userDetails = await User.findOne({ email }, { phone: 1, _id: 1, name: 1 });

  if (!userDetails) {
    throw new Error('User not found');
  }

  const token = createToken({ userId: userDetails._id }, expiresAt);

  return {
    token,
    name: userDetails.name
  };
};

exports.getPortfolioValue = async (userId) => {
  const properties = await Property.find({ userId }, { propertyPrice: 1, size: 1, priceTrend: 1 });
  let totalValue = 0;
  let totalArea = 0;
  let priceTrendMap = {};

  properties.forEach((prop) => {
    totalValue += Number(prop.propertyPrice) || 0;
    totalArea += Number(prop.size) || 0;

    if (prop.priceTrend) {
      let parsedTrend;
      parsedTrend = typeof prop.priceTrend === 'string' ? JSON.parse(prop.priceTrend) : prop.priceTrend;
      for (const [year, price] of Object.entries(parsedTrend)) {
        priceTrendMap[year] = (priceTrendMap[year] || 0) + Number(price);
      }
    }
  });

  const priceTrend = Object.entries(priceTrendMap).map(([year, price]) => ({ year, price }));

  return {
    totalValue,
    totalArea,
    propertiesCount: properties.length,
    priceTrend,
  };
};

exports.getAllProperties = async (userId) => {
  // try {
    const properties = await Property.find(
      { userId },
      { _id: 1, size: 1, areaType: 1, landType: 1, coordinates: 1, documents: 1, priceTrend: 1 }
    );

    const formattedProperties = properties.map((property) => {
      let parsedTrend = null;
      if (typeof property.priceTrend === 'string') {
        // try {
          parsedTrend = JSON.parse(property.priceTrend);
        // } catch (err) {
          // console.warn(`Invalid priceTrend JSON for property ID ${property._id}`);
        // }
      } else {
        parsedTrend = [];
      }

      return {
        ...property.toObject(),
        priceTrend: parsedTrend,
      };
    });

    return formattedProperties;
  // } catch (error) {
  //   console.error('Error in getAllProperties:', error);
  //   return {
  //     success: false,
  //     message: 'Error while fetching all properties',
  //   };
  // }
};


exports.resetPasswordSer = async (email, password, userId, name, phone) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, email },
    { password, name, phone },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(status.NOT_FOUND, 'User not found with the provided credentials.');
  }

  return updatedUser;
};

exports.userLoginSer = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found with the provided email.');
  }

  if (!user.password) {
    throw new ApiError(status.NOT_FOUND, 'Password is not set. Please set the password first');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(status.UNAUTHORIZED, 'Invalid password.');
  }

  let token = createToken({ userId: user._id });

  const returnData = {  _id: user._id, email: user.email, name: user.name, phone: user.phone  }

  return { user: returnData, token } ;
};

exports.userUpdateSer = async (userId, name, email, phone) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing user ID");
  }
  let body = {};
  if (email) body.email = email;  
  if (phone) body.phone = phone;  
  if (name) body.name = name;  
  return await User.findByIdAndUpdate(userId, body, { new: true });
};

exports.addPropertyDocumentSer = async (file, userId, propertyId) => {
  const result = await handleUploadAndGetUrl(file);
  const property = await Property.findById(propertyId);
  if (!property.documents || !Array.isArray(property.documents)) {
    property.documents = [];
  }
  property.documents.push(result.url);
  return await property.save();
};