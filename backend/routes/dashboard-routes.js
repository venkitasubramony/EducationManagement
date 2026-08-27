import express from "express";
const router = express.Router();
import {Student} from "../mongoose/schema/student.js";
import {Course} from "../mongoose/schema/course.js";
import {Enrollment} from "../mongoose/schema/enrollment.js"

router.get('/stats',async (req,res)=>{

     try {

        const [
            totalStudents,
            activeCourses,
            totalEnrollments,
            completedEnrollments
        ] = await Promise.all([

            Student.countDocuments(),

            Course.countDocuments({
                status: "active"
            }),

            Enrollment.countDocuments(),

            Enrollment.countDocuments({
                status: "completed"
            })

        ]);


        const completionRate =
            totalEnrollments > 0
                ? Math.round(
                    (completedEnrollments /
                        totalEnrollments) * 100
                )
                : 0;


        return res.status(200).json({

            totalStudents,

            activeCourses,

            totalEnrollments,

            completedEnrollments,

            completionRate

        });


    } catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to load dashboard statistics"
        });

    }


    
});

router.get('/popular-courses',async (req,res)=>{

    try {

            const popularCourses =
                await Enrollment.aggregate([

                    // Group enrollments by course
                    {
                        $group: {
                            _id: "$course",
                            studentCount: {
                                $sum: 1
                            }
                        }
                    },


                    // Sort highest enrollment first
                    {
                        $sort: {
                            studentCount: -1
                        }
                    },


                    // Get only top 5
                    {
                        $limit: 5
                    },


                    // Join course collection
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "course"
                        }
                    },


                    // Convert course array to object
                    {
                        $unwind: "$course"
                    },


                    // Return only fields needed by dashboard
                    {
                        $project: {
                            _id: 0,

                            courseId: "$course._id",

                            coursename:
                                "$course.coursename",

                            coursecode:
                                "$course.coursecode",

                            capacity:
                                "$course.capacity",

                            status:
                                "$course.status",

                            studentCount: 1
                        }
                    }

                ]);


            return res.status(200).json({
                popularCourses
            });


        } catch (error) {

            console.error(
                "Popular courses error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to load popular courses"
            });
        }

});

export default router;