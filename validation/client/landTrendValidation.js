const Joi = require('joi');

exports.validateLatitude = (req, res, next) => {
    const schema = Joi.object({ latitude: Joi.number().min(-90).max(90).required() }).unknown();
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    return next();
}

exports.validateLongitude = (req, res, next) => {
    const schema = Joi.object({ longitude: Joi.number().min(-180).max(180).required() }).unknown();
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    return next();
}


exports.validateSizeSqft = (req, res, next) => {
    const schema = Joi.object({ size_sqft: Joi.number().required() }).unknown();
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    return next();
}


exports.validateAreaType = (req, res, next) => {
    const schema = Joi.object({ area_type: Joi.string().trim().required() }).unknown();
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    return next();
}
