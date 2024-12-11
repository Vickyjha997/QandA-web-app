const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// Create Schema
const studentSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        class: {
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
        }
    }
);

module.exports = mongoose.model('Student', studentSchema);