const mongoose = require('mongoose');

//schema define
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

//use the upper schema
const User = mongoose.model('User', userSchema);

module.exports = User;
