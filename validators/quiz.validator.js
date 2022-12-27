const Joi = require('joi');
const questionSchema = require('./question.validator');

const quizSchema = Joi.object({
    name: Joi.string().required(),
    instructions: Joi.string().min(5).required(),
    isEnabled: Joi.boolean().required(),
    questions: Joi.array().items(questionSchema),

});

module.exports = quizSchema;