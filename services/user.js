const { status } = require('http-status');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const { createToken } = require('../middlewares/auth');
const ApiError = require('../utils/ApiError');
const { handleUploadAndGetUrl } = require('./upload');

exports.addNewUser = async (name, email, phone, password) =>
  User.create({ name, email, phone, password });

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
    name: userDetails.name,
  };
};

exports.getPortfolioValue = async (userId) => {
  const properties = await Property.find({ userId }, { propertyPrice: 1, size: 1, priceTrend: 1 });
  let totalValue = 0;
  let totalArea = 0;
  const priceTrendMap = {};

  properties.forEach((prop) => {
    totalValue += Number(prop.propertyPrice) || 0;
    totalArea += Number(prop.size) || 0;

    if (prop.priceTrend) {
      const parsedTrend =
        typeof prop.priceTrend === 'string' ? JSON.parse(prop.priceTrend) : prop.priceTrend;

      Object.entries(parsedTrend).forEach(([year, price]) => {
        priceTrendMap[year] = (priceTrendMap[year] || 0) + Number(price);
      });
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
  const properties = await Property.find(
    { userId },
    {
      _id: 1,
      size: 1,
      areaType: 1,
      landType: 1,
      coordinates: 1,
      documents: 1,
      priceTrend: 1,
      explaination: 1,
    }
  );

  const formattedProperties = properties.map((property) => {
    let parsedTrend = null;
    if (typeof property.priceTrend === 'string') {
      parsedTrend = JSON.parse(property.priceTrend);
    } else {
      parsedTrend = [];
    }

    return {
      ...property.toObject(),
      priceTrend: parsedTrend,
    };
  });

  return formattedProperties;
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

  const token = createToken({ userId: user._id });
  const { _id, name, phone } = user;

  const returnData = { _id, email, name, phone };

  return { user: returnData, token };
};

exports.userUpdateSer = async (userId, name, email, phone) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid or missing user ID');
  }
  const body = {};
  if (email) body.email = email;
  if (phone) body.phone = phone;
  if (name) body.name = name;
  return User.findByIdAndUpdate(userId, body, { new: true });
};

exports.addPropertyDocumentSer = async (file, userId, propertyId) => {
  const result = await handleUploadAndGetUrl(file);
  const property = await Property.findById(propertyId);
  if (!property.documents || !Array.isArray(property.documents)) {
    property.documents = [];
  }
  property.documents.push(result.url);
  return property.save();
};
