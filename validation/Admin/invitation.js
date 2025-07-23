const Joi = require('joi');

const invitationLink = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
}).xor('email', 'phone');


module.exports = { invitationLink };
