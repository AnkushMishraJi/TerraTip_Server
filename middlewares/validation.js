/* eslint-disable consistent-return */
const Joi = require('joi');

exports.validateSendOTP = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

exports.validateVerifyOTP = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
    idToken: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
