const mongoose = require('mongoose');
const optionSchema = require('./options');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],

    answer: [{
      type: Number,
      required: true
    }],

    isEnabled: {
        type: Boolean,
        default: true
    },

    explanation:{
      type: String,
      default: ""
    }

}, {
    timestamps: true
});

module.exports = questionSchema;