const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const tutorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    standard: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Maths', 'Computer Science', 'DSA', 'Development', 'MERN', 'Spring Boot']
    }
});


module.exports = mongoose.model('Tutor', tutorSchema);
