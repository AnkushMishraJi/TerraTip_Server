const Joi = require('joi');
const constants = require('../../config/constant');

exports.validateName = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateEmail = (req, res, next) => {
  const schema = Joi.object({ email: Joi.string().email()}).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validatePhoneNumber = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(constants.regex.phone).required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validatePropertyGeoLocation = (req, res, next) => {
  const schema = Joi.object({
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validatePropertySize = (req, res, next) => {
  const schema = Joi.object({
    size: Joi.string()
      .trim()
      .pattern(constants.regex.size)
      .required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

exports.validatePropertyAreaType = (req, res, next) => {
  const schema = Joi.object({
    areaType: Joi.string()
      .valid(...Object.values(constants.areaType))
      .required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};