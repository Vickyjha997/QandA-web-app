const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerschema = new Schema(
    {
        tutorId:{
            type:String,
            required:true
        },
        questionId:{
            type:String,
            required:true
        },
        answerIntro: {
            type: String,
            required: true
        },
        answerImages: {
            type: [String], // Changed to an array of strings
            required: true
        },
        answerConclusion: {
            type: String,
            required: true,
        }
    }
);

module.exports=mongoose.model('Answer',answerschema);