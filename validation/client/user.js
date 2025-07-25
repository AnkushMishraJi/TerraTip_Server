const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

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

const passwordSchema = Joi.string()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,16}$'))
  .required()
  .messages({
    'string.pattern.base':
      'Password must be 8-16 characters long and include uppercase, lowercase, number, and special character.',
  });

const generateTokenVal = {
  body: Joi.object().keys({
    email: email.required(),
  }),
};

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

const addUserVal = {
  body: Joi.object().keys({
    name: name.required(),
    email: email.required(),
    phone: phone.optional(),
    password: passwordSchema,
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match password',
      }),
  }),
};

const updateUserVal = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .message("Phone number must be a valid 10-digit Indian mobile number")
    .optional(),
  params: Joi.object({ userId: Joi.objectId().required() }),

});


module.exports = {
  addUserVal,
  generateTokenVal,
  resetPasswordVal,
  userLoginVal,
  updateUserVal
};
