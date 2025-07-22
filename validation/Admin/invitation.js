const Joi = require('joi');

const invitationLink = Joi.object({
  email: Joi.string().email(),
  phoneNumber: Joi.string().pattern(/^[6-9]\d{9}$/),
}).xor('email', 'phoneNumber');


module.exports = { invitationLink };
