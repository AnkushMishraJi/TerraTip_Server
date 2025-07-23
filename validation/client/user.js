const Joi = require('joi');

const phone = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
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

const addUserVal = {
  body: Joi.object().keys({
    name: name.required(),
    email: email.required(),
    phone: phone.optional(),
  }),
};

const generateTokenVal = {
  body: Joi.object().keys({
    email: email.required(),
  }),
};

const passwordSchema = Joi.string()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,16}$'))
  .required()
  .messages({
    'string.pattern.base':
      'Password must be 8-16 characters long and include uppercase, lowercase, number, and special character.',
  });

const resetPasswordVal = {
  body: Joi.object({
    password: passwordSchema,
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match password',
      }),
  }),
};

const userLoginVal = {
  body: Joi.object({
    email: email.required(),
    password: passwordSchema,
  })
}

module.exports = {
  addUserVal,
  generateTokenVal,
  resetPasswordVal,
  userLoginVal
};
