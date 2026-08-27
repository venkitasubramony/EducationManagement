import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js"
import express from "express";
import authRoutes from './routes/auth-routes.js'
import homeRoutes from './routes/home-routes.js'
import adminRoutes from './routes/admin-routes.js'
import dashboardRoutes from './routes/dashboard-routes.js'
import path from "path";
import { fileURLToPath } from "url";
// Create __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//import mongoose from "mongoose";


import { Student } from "./mongoose/schema/student.js";
import { Course } from "./mongoose/schema/course.js";
import { Enrollment } from "./mongoose/schema/enrollment.js"

import cors from "cors";
connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// mongoose.connect('mongodb://localhost/EduManage').then(()=>{console.log('DB connected')})
// .catch((err)=>{console.log(`Error:${err}`)})
app.use(express.json());
//Authentication
app.use('/api/auth', authRoutes)
//Roles
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)



app.get("/api/students", async (req, res) => {

    const {
        search,
        status,
        recent
    } = req.query;

    const filter = {};

    // Search student name or student code
    if (search && search.trim() !== "") {
        filter.$or = [
            {
                fullName: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                studentId: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    // Status filter
    if (status && status !== "all") {
        filter.status = status;
    }
    const pipeline = [
        // Apply your existing student filters
        {
            $match: filter
        },

        // Join enrollments
        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "student",
                as: "enrollments"
            }
        },

        // Join courses using the course IDs
        // inside the enrollments array
        {
            $lookup: {
                from: "courses",
                localField: "enrollments.course",
                foreignField: "_id",
                as: "courses"
            }
        },

        // Return fields needed by frontend
        {
            $project: {
                fullName: 1,
                studentId: 1,
                email: 1,
                phone: 1,
                status: 1,
                joinedDate: 1,

                courseNames: "$courses.coursename"
            }
        }
    ];
    // Recent students
    if (recent === "true") {

        pipeline.push({
            $sort: {
                _id: -1
            }
        });

        pipeline.push({
            $limit: 5
        });
    }
    const Students = await Student.aggregate(pipeline)

    // const Students = await Student.find(filter);
    return res.status(200).send(Students)
})

app.get("/api/courses", async (req, res) => {

    const {
        search,
        status,
        department
    } = req.query;

    const filter = {};

    // Search course name or course code
    if (search && search.trim() !== "") {
        filter.$or = [
            {
                coursename: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                coursecode: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    // Status filter
    if (status && status !== "all") {
        filter.status = status;
    }

    // Department filter
    if (department && department !== "all") {
        filter.department = department;
    }
    console.log(filter)
    const Courses = await Course.find(filter);
    return res.status(200).send(Courses)
})



app.post('/api/addstudent', async (req, res) => {

    //console.log(req.body);
    const { body } = req; //if validation schema is not used

    const newStudent = new Student(body);
    try {
        const savedStudent = await newStudent.save();
        return res.status(201).send(savedStudent);

    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Student not saved");
    }

})

app.post('/api/addcourse', async (req, res) => {

    //console.log(req.body);
    const { body } = req; //if validation schema is not used

    const newCourse = new Course(body);
    try {
        const savedCourse = await newCourse.save();
        return res.status(201).send(savedCourse);

    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Course not saved");
    }

})

app.post('/api/addenrollment', async (req, res) => {

    //console.log(req.body);

    try {

        const {
            studentId,
            courseId,
            status
        } = req.body;


        const newEnrollment = new Enrollment({
            student: studentId,
            course: courseId,
            status: status
        });
        const savedEnrollment = await newEnrollment.save();
        return res.status(201).send(savedEnrollment);

    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Enrollment not saved");
    }

})

app.get('/api/enrollments', async (req, res) => {
    //console.log(req.query)
    try {

        const {
            search
        } = req.query;

        const pipeline = [

            // Join Student
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student"
                }
            },

            {
                $unwind: "$student"
            },


            // Join Course
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "course"
                }
            },

            {
                $unwind: "$course"
            }
        ];


        // Search filter
        if (search && search.trim() !== "") {

            const searchRegex = {
                $regex: search.trim(),
                $options: "i"
            };

            pipeline.push({
                $match: {
                    $or: [
                        {
                            "student.fullName":
                                searchRegex
                        },
                        {
                            "student.studentId":
                                searchRegex
                        },
                        {
                            "course.coursename":
                                searchRegex
                        }
                    ]
                }
            });
        }


        // Sort
        pipeline.push({
            $sort: {
                enrollmentDate: -1
            }
        });


        // const enrollments = await Enrollment.find()
        //     .populate("student", "fullName studentId")
        //     .populate("course", "coursename")
        //     .sort({ enrollmentDate: -1 });


        const enrollments =
            await Enrollment.aggregate(pipeline);

        return res.status(200).json(enrollments);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch enrollments"
        });
    }
});

app.delete("/api/enrollments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEnroll = await Enrollment.findByIdAndDelete(id);

        if (!deletedEnroll) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            message: "Enrollment deleted successfully",
            course: deletedEnroll
        });

    } catch (error) {
        console.error("Delete Enrollment error:", error);

        res.status(500).json({
            message: "Failed to delete Enrollment"
        });
    }
})

app.put("/api/courses/:id", async (req, res) => {

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        course.coursename = req.body.coursename;
        course.coursecode = req.body.coursecode;
        course.department = req.body.department;
        course.duration = req.body.duration;
        course.description = req.body.description;
        course.capacity = req.body.capacity;
        course.status = req.body.status;

        await course.save();

        res.status(200).send("Course updated")
    } catch (err) {
        res.status(500).send(err.message);
    }


})

app.delete("/api/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Course deleted successfully",
            course: deletedCourse
        });

    } catch (error) {
        console.error("Delete course error:", error);

        res.status(500).json({
            message: "Failed to delete course"
        });
    }
})

app.put("/api/students/:id", async (req, res) => {

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        student.fullName = req.body.fullName;
        student.email = req.body.email;
        student.phone = req.body.phone;
        student.status = req.body.status;

        await student.save();

        res.status(200).send("Student updated")
    } catch (err) {
        res.status(500).send(err.message);
    }


});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });

    } catch (error) {
        console.error("Delete student error:", error);

        res.status(500).json({
            message: "Failed to delete student"
        });
    }
})

// --------------------
// REACT STATIC FILES
// --------------------

const frontendPath = path.join(
  __dirname,
  "../studentsCourse/dist"
);

app.use(express.static(frontendPath));

// --------------------
// REACT ROUTER FALLBACK
// --------------------

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  if (req.method === "GET") {
    console.log("Serving React route:", req.originalUrl);

    return res.sendFile(
      path.join(frontendPath, "index.html")
    );
  }

  next();
});

app.listen(port, () => {
    console.log(`App is runing on port ${port}`);
})