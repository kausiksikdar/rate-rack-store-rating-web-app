const Joi = require('joi');

// validates user registration data
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(20).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/).required(),
        address: Joi.string().max(400).allow(''),
        role: Joi.string().valid('admin', 'user', 'store_owner').required(),
    });
    return schema.validate(data);
};

// validates login credentials
const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};

// validates rating value 
const validateRating = (data) => {
    const schema = Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
    }).unknown(true);  
    return schema.validate(data);
};

module.exports = { validateUser, validateLogin, validateRating };