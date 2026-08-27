import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema(
    {
        fullName:{
            type:mongoose.Schema.Types.String,
            requied:true,
            unique:true
        },
        studentId:{
            type:mongoose.Schema.Types.String,
            requied:true,
            unique:true
        },
        email:{
            type:mongoose.Schema.Types.String,
            requied:true,
            unique:true
        },
        phone:{
            type:mongoose.Schema.Types.Number,
            requied:true,
            unique:true
        },
        status:{
            type:mongoose.Schema.Types.String,
             requied:true
        },
        joinedDate: {
            type: Date,
            default: Date.now
        },

    }
)
export const Student = mongoose.model("Student",StudentSchema)