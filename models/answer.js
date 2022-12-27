const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answeredQuestionSchema = new Schema({
    questionId: {
        type: String,
        required: true,
    },
    optionSelected: [{
        type: Number,
        required: true
    }],
    status: {
        type: Boolean,
        default: false
    }
})

const answerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    quizId: {
        type: String,
        requires: true
    },
    questionAnswered: [answeredQuestionSchema],

    score:{
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

var Answers = mongoose.model('Answers', answerSchema);


module.exports = Answers;