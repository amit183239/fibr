const Joi = require('joi');
const answerSchemaItem = Joi.object({
    questionId: Joi.string().required(),
    optionSelected: Joi.array().items(Joi.number()).required()
})

const answerSchema = Joi.object({
    questionAnswered: Joi.array().items(answerSchemaItem),

});

module.exports = answerSchema;