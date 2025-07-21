const Joi = require('joi');

const phone = Joi.string()
  .pattern(/^[6-9]\d{9}$/) // (starts with 6-9, 10 digits)
  .required()
  .messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number',
  });

const name = Joi.string()
  .trim()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z\s]+$/)
  .message('Name must contain only letters and spaces');

const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } });

const addUser = {
  body: Joi.object().keys({
    name: name.required(),
    email: email.optional(),
    phone,
  }),
};

const generateToken = {
  body: Joi.object().keys({
    phone,
  }),
};

module.exports = {
  addUser,
  generateToken,
};
