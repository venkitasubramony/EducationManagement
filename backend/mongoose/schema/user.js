import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        email:{
            type:mongoose.Schema.Types.String,
            requied:true,
            unique:true
        },
        password:{
            type:mongoose.Schema.Types.String,
            requied:true
        },
        role:{
            type:String,
            requied:true,
            enum:['user','admin'],
            default:'user'
        }

    }
)
export const User = mongoose.model("User",UserSchema)