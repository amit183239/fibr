const Joi = require('joi')

const answerSchema = Joi.object({
    option: Joi.string().required(),
})
const questionSchema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(answerSchema).required(),
    isEnabled: Joi.boolean().default(true),
    answer: Joi.array().items(Joi.number()).required()
})

module.exports = questionSchema;