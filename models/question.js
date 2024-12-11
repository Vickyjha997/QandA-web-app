const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// Create Schema
const questionSchema = new Schema(
    {
        tutorId:{
            type:String,
        },
        studentId:{
            type:String,
            required:true
        },
        subject: {
            type: String,
            required: true
        },
        questionImage: {
            type: String,
        },
        questionText: {
            type: String,
            required: true,
        }
    }
);

module.exports = mongoose.model('Question', questionSchema);