const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const constants = require('../../config/constant');

const size = Joi.number().min(100).required();
const areaType = Joi.string().valid(...Object.values(constants.areaType)).required();
const coordinates = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
}).required();
const landType = Joi.string().trim().optional();

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


module.exports = { addPropertyVal, paramsVal };
