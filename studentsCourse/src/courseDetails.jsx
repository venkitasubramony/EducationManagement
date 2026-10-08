import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import "./courseDetails.css";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/courses/${id}/details`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to fetch course"
                    );
                }

                setCourse(data.course);

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);


    if (loading) {
        return (
            <div className="course-details-loading">
                Loading course details...
            </div>
        );
    }


    if (error) {
        return (
            <div className="course-details-error">
                {error}
            </div>
        );
    }


    if (!course) {
        return (
            <div className="course-details-error">
                Course not found
            </div>
        );
    }


    const enrolledCount =
        course.enrolledStudents?.length || 0;

    const availableSeats =
        Math.max(
            course.capacity - enrolledCount,
            0
        );


    return (

        <>
            <title>Course Details</title>
            <div className="app">
                <NavBar />
                <main className="main">
                    <TopBar />
                    <div className="course-details-page">

                        {/* Header */}

                        <div className="course-details-header">

                            <div>
                                <h1>
                                    {course.coursename}
                                </h1>

                                <p className="course-code">
                                    Course Code:{" "}
                                    <strong>
                                        {course.coursecode}
                                    </strong>
                                    {" "}
                                    <span
                                        className={`course-status ${course.status === "active"
                                                ? "status-active"
                                                : "status-inactive"
                                            }`}
                                    >
                                        {course.status}
                                    </span>
                                </p>

                            </div>


                            <button
                                className="back-btn"
                                onClick={() => navigate("/courses")}
                            >
                                ← Back to Courses
                            </button>

                        </div>


                        {/* Course Information */}

                        <div className="course-info-card">

                            <div className="course-info-title">
                                <h2>
                                    Course Information
                                </h2>
                            </div>


                            <div className="course-description">

                                <h3>
                                    Description
                                </h3>

                                <p>
                                    {course.description ||
                                        "No course description available."}
                                </p>

                            </div>


                            <div className="course-meta">

                                <div className="meta-item">

                                    <span>
                                        Department
                                    </span>

                                    <strong>
                                        {course.department || "-"}
                                    </strong>

                                </div>


                                <div className="meta-item">

                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {course.duration || "-"}
                                    </strong>

                                </div>


                                <div className="meta-item">

                                    <span>
                                        Capacity
                                    </span>

                                    <strong>
                                        {course.capacity}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* Enrollment Statistics */}

                        <div className="enrollment-stats">

                            <div className="stat-card">

                                <div className="stat-icon">
                                    👥
                                </div>

                                <div>
                                    <span>
                                        Capacity
                                    </span>

                                    <strong>
                                        {course.capacity}
                                    </strong>
                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🎓
                                </div>

                                <div>
                                    <span>
                                        Enrolled
                                    </span>

                                    <strong>
                                        {enrolledCount}
                                    </strong>
                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🪑
                                </div>

                                <div>
                                    <span>
                                        Available
                                    </span>

                                    <strong>
                                        {availableSeats}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* Enrollment Progress */}

                        <div className="enrollment-card">

                            <div className="enrollment-card-header">

                                <div>
                                    <h2>
                                        Enrollment
                                    </h2>

                                    <p>
                                        {enrolledCount} of{" "}
                                        {course.capacity} seats filled
                                    </p>
                                </div>

                                <strong>
                                    {course.capacity > 0
                                        ? Math.round(
                                            (enrolledCount /
                                                course.capacity) *
                                            100
                                        )
                                        : 0}
                                    %
                                </strong>

                            </div>


                            <div className="progress-bar">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${course.capacity > 0
                                            ? Math.min(
                                                (enrolledCount /
                                                    course.capacity) *
                                                100,
                                                100
                                            )
                                            : 0
                                            }%`
                                    }}
                                />

                            </div>

                        </div>


                        {/* Enrolled Students */}

                        <div className="students-card">

                            <div className="students-card-header">

                                <div>
                                    <h2>
                                        Enrolled Students
                                    </h2>

                                    <p>
                                        Students currently enrolled
                                        in this course
                                    </p>
                                </div>

                                <span className="student-count">
                                    {enrolledCount} Students
                                </span>

                            </div>


                            {enrolledCount === 0 ? (

                                <div className="no-students">
                                    No students are currently
                                    enrolled in this course.
                                </div>

                            ) : (

                                <div className="students-table-wrapper">

                                    <table className="students-table">

                                        <thead>
                                            <tr>

                                                <th>
                                                    Student
                                                </th>

                                                <th>
                                                    Student ID
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Enrollment Date
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>
                                        </thead>


                                        <tbody>

                                            {course.enrolledStudents.map(
                                                (enrollment) => (

                                                    <tr
                                                        key={
                                                            enrollment._id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="student-name">

                                                                <div className="student-avatar">

                                                                    {enrollment.student?.fullName
                                                                        ?.substring(
                                                                            0,
                                                                            2
                                                                        )
                                                                        .toUpperCase() ||
                                                                        "?"}

                                                                </div>

                                                                <strong>
                                                                    {
                                                                        enrollment
                                                                            .student
                                                                            ?.fullName
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {
                                                                enrollment
                                                                    .student
                                                                    ?.studentId
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                enrollment
                                                                    .student
                                                                    ?.email
                                                            }
                                                        </td>


                                                        <td>
                                                            {enrollment.enrollmentDate
                                                                ? new Date(
                                                                    enrollment.enrollmentDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={`enrollment-status ${enrollment.status ===
                                                                    "active"
                                                                    ? "active"
                                                                    : "inactive"
                                                                    }`}
                                                            >
                                                                {
                                                                    enrollment.status
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default CourseDetails;