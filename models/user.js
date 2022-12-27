const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        requires: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Users = mongoose.model('Users', userSchema);


module.exports = Users;