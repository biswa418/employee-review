const mongoose = require('mongoose');

//schema define
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    sendReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    gotReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true
    }
);

//use the upper schema
const User = mongoose.model('User', userSchema);

module.exports = User;
