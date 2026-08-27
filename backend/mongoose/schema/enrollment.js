import mongoose from "mongoose";
const EnrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        enrollmentDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["active", "inactive","completed","cancelled"],
            default: "active"
        }

    },
    {
        timestamps: true
    }
)
export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema)