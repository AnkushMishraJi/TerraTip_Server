const Joi = require('joi');

const latitude = Joi.number().min(-90).max(90).required()
const longitude = Joi.number().min(-180).max(180).required() 
const size_sqft = Joi.number().required() 
const area_type = Joi.string().trim().required() 

const getTrendVal = {
  body: Joi.object().keys({
    latitude,
    longitude,
    size_sqft,
    area_type
  }),
};

const getTrendByLocationVal = {
  body: Joi.object().keys({ latitude, longitude }),
};


module.exports = { getTrendVal, getTrendByLocationVal };
