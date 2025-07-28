const BaseJoi = require('joi');
const joiObjectId = require('joi-objectid')(BaseJoi);
const constants = require('../../config/constant');
const Joi = BaseJoi;

const size = Joi.number().min(100).required();

const coordinates = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
}).required();

const landType = Joi.string()
  .valid(...Object.values(constants.landType))
  .trim()
  .required();

const areaType = Joi.string()
  .valid(...Object.values(constants.areaType))
  .required();

const paramsWithId = Joi.object({
  userId: joiObjectId().required(),
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
    propertyId: joiObjectId().required().label('propertyId'),
  }),
};

const viewPropertyDocumentValidator = Joi.object({
  uuid: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv5'] })
    .required()
    .messages({
      'string.guid': 'UUID must be a valid UUID',
      'any.required': 'UUID is required',
    }),
  propertyId: joiObjectId().required().messages({
    'string.pattern.base': 'Property ID must be a valid Mongo ObjectId',
    'any.required': 'Property ID is required',
  }),
});

module.exports = {
  addPropertyVal,
  paramsVal,
  addPropertyDocument,
  viewPropertyDocumentValidator,
};
