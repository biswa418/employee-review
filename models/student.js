const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    batch: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    courseScore: []
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;