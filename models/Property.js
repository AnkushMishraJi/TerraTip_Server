const mongoose = require('mongoose');
const constants = require('../config/constant');

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be >= -90'],
        max: [90, 'Latitude must be <= 90'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be >= -180'],
        max: [180, 'Longitude must be <= 180'],
      },
    },

    size: {
      type: String,
      trim: true,
      default: null,
    },

    areaType: {
      type: String,
      enum: Object.values(constants.areaType),
      default: null,
    },

    landType: {
      type: String,
      trim: true,
      default: null,
    },

    propertyPrice: {
      type: Number,
      default: 0
    },

    propertyPriceYear: {
      type: String,
      default: null,
    },

    priceFetchDate: {
      type: Date,
      default: null
    },

    priceTrend: {
      type: Object,
      default: null   
    },

    explaination: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Property', propertySchema);
