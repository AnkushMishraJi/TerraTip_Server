const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const constants = require('../../config/constant');

const size = Joi.number().min(100).required();

const coordinates = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
}).required();

const landType = Joi.string().valid(...Object.values(constants.landType)).trim().required();
const areaType = Joi.string().valid(...Object.values(constants.areaType)).required();


const paramsWithId = Joi.object({
  userId: Joi.objectId().required(),
});

const addPropertyVal = {
  body: Joi.object().keys({
    coordinates,
    size,
    areaType,
    landType
  }),
  params: paramsWithId,
};

const paramsVal = {
  params: paramsWithId,
};

const addPropertyDocument = {
  body: Joi.object().keys({
    propertyId: Joi.string().required().label('propertyId'),
  }),
};


module.exports = { addPropertyVal, paramsVal, addPropertyDocument };
