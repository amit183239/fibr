const mongoose = require('mongoose');
const questionSchema = require('./question');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    instructions: {
        type: String,
        required: true
    },

    isEnabled: {
        type: Boolean,
        default: true
    },

    questions: [questionSchema],

    duration :{
      hours : {
        type : Number,
        default: 0
      },

      minutes : {
        type : Number,
        default: 0
      },

      seconds : {
        type : Number,
        default: 0
      }

    }
}, {
    timestamps: true
});

var Quizes = mongoose.model('Quiz', quizSchema);

module.exports = Quizes;