import mongoose from "mongoose";
const CourseSchema = new mongoose.Schema(
    {
        coursename: {
            type: mongoose.Schema.Types.String,
            requied: true,
            unique: true
        },
        coursecode: {
            type: mongoose.Schema.Types.String,
            requied: true,
            unique: true
        },
        department: {
            type: mongoose.Schema.Types.String,
            requied: true
        },
        duration: {
            type: mongoose.Schema.Types.String,
            requied: true
        },

        description: {
            type: mongoose.Schema.Types.String,
            requied: true
        },
        capacity: {
            type: mongoose.Schema.Types.Number,
            requied: true
        },
        status: {
            type: mongoose.Schema.Types.String,
            requied: true,
            default: 'active'
        },
        activeEnrollmentCount: {
            type: Number,
            default: 0,
            min: 0
        }

    }
)
export const Course = mongoose.model("Course", CourseSchema)