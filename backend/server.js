import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/db.js"
import express from "express";
import authRoutes from './routes/auth-routes.js'
import homeRoutes from './routes/home-routes.js'
import adminRoutes from './routes/admin-routes.js'
import dashboardRoutes from './routes/dashboard-routes.js'

import mongoose from "mongoose";


import { Student } from "./mongoose/schema/student.js";
import { Course } from "./mongoose/schema/course.js";
import { Enrollment } from "./mongoose/schema/enrollment.js"

import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// -------------------------
// Upload directory
// -------------------------

const uploadDir = path.join(
    __dirname,
    "uploads"
);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );
}


// -------------------------
// Make uploads publicly accessible
// -------------------------

app.use(
    "/uploads",
    express.static(uploadDir)
);


// -------------------------
// Multer configuration
// -------------------------

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {
        cb(null, uploadDir);
    },

    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            );

        const filename =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1e9
            ) +
            extension;

        cb(
            null,
            filename
        );
    }
});

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(
            null,
            true
        );
    } else {

        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};


const upload = multer({

    storage,

    limits: {
        fileSize:
            5 *
            1024 *
            1024
    },

    fileFilter
});

app.get("/api/students", async (req, res) => {

    const {
        search,
        status,
        recent,
        page = 1,
        limit = 10
    } = req.query;


    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);




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

    const skip = (currentPage - 1) * pageSize;

    // total matching students
    const totalStudents = await Student.countDocuments(filter);
    const pipeline = [
        // Apply your existing student filters
        {
            $match: filter
        },

        {
            $skip: skip
        },
        {
            $limit: pageSize
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
    const totalPages = Math.ceil(totalStudents / pageSize);
    const Students = await Student.aggregate(pipeline)

    // const Students = await Student.find(filter);
    return res.status(200).send({
        Students, pagination: {
            currentPage,
            pageSize,
            totalStudents,
            totalPages,
            hasNextPage:
                currentPage < totalPages,
            hasPreviousPage:
                currentPage > 1
        }
    })
})


app.get("/api/students/:id/profile", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const studentProfile = await Student.aggregate([

            // Get selected student
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
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

            // Join courses referenced by enrollments
            {
                $lookup: {
                    from: "courses",
                    localField: "enrollments.course",
                    foreignField: "_id",
                    as: "courses"
                }
            },

            // Build frontend-friendly response
            {
                $project: {
                    fullName: 1,
                    studentId: 1,
                    email: 1,
                    phone: 1,
                    status: 1,


                    enrollments: {
                        $map: {
                            input: "$enrollments",
                            as: "enrollment",

                            in: {
                                _id: "$$enrollment._id",

                                enrollmentDate:
                                    "$$enrollment.enrollmentDate",

                                status:
                                    "$$enrollment.status",

                                course: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$courses",
                                                as: "course",

                                                cond: {
                                                    $eq: [
                                                        "$$course._id",
                                                        "$$enrollment.course"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);


        if (studentProfile.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        return res.status(200).json({
            student: studentProfile[0]
        });

    } catch (error) {

        console.error(
            "Student profile error:",
            error
        );

        return res.status(500).json({
            message: "Unable to fetch student profile"
        });
    }
});

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



app.post('/api/addstudent', upload.single("photo"), async (req, res) => {

    //console.log(req.body);
    const { body } = req; //if validation schema is not used
//console.log(req);
    const newStudent = new Student({
        fullName: body.fullName,

        studentId: body.studentId,

        email: body.email,

        phone: body.phone,

        status:
            body.status ||
            "active",

        photo:
            req.file
                ? req.file.filename
                : null
    });
    try {
        
         const savedStudent = await newStudent.save();
        return res.status(201).send(savedStudent); 
         

    }
    catch (err) {
        console.log(err);
        if (req.file) {

            fs.unlink(
                req.file.path,
                () => { }
            );
        }
        return res.status(400).send("Student not saved");
    }

})

// -------------------------
// Multer error handling
// -------------------------

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        if (
            error instanceof
            multer.MulterError
        ) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Image size must be less than 5 MB"
                    });
            }

            return res
                .status(400)
                .json({
                    message:
                        error.message
                });
        }


        if (
            error.message ===
            "Only JPG, PNG and WEBP images are allowed"
        ) {

            return res
                .status(400)
                .json({
                    message:
                        error.message
                });
        }


        next(error);
    }
);

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

app.listen(port, () => {
    console.log(`App is runing on port ${port}`);
})