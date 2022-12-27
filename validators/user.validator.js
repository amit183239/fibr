const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.array().items(Joi.string().email().required()),

});

module.exports = userSchema;