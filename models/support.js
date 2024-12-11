const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// Create Schema
const supportSchema = new Schema(
    {
        tutorId:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        subject: {
            type: String,
            required: true
        },
        Deatils: {
            type: String,
            required:true
        },
        Attachment: {
            type: String,
        }
    }
);

module.exports = mongoose.model('Support', supportSchema);