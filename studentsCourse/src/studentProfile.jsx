
import "./studentProfile.css";
import { useParams } from "react-router";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import {
    useEffect,
    useState
} from "react";
import { useNavigate } from "react-router";

const StudentProfile = () => {

    const navigate = useNavigate();
    
    const { id } = useParams();

    const [student, setStudent] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    
    // Sample data for UI
    // Later replace this with API data
    // const student = {
    //     _id: "1",
    //     fullName: "John Doe",
    //     studentId: "STU-001",
    //     email: "john@example.com",
    //     phone: "+91 98765 43210",
    //     status: "active",
    //     createdAt: "2026-08-10",

    //     enrollments: [
    //         {
    //             _id: "e1",
    //             courseName: "Full Stack Web Development",
    //             courseCode: "WEB-101",
    //             enrollmentDate: "2026-08-12",
    //             status: "active"
    //         },
    //         {
    //             _id: "e2",
    //             courseName: "Python Programming",
    //             courseCode: "PY-101",
    //             enrollmentDate: "2026-07-15",
    //             status: "completed"
    //         },
    //         {
    //             _id: "e3",
    //             courseName: "UI/UX Design",
    //             courseCode: "UI-201",
    //             enrollmentDate: "2026-05-10",
    //             status: "cancelled"
    //         }
    //     ]
    // };

    useEffect(() => {

        const fetchStudentProfile =
            async () => {

                try {

                    setLoading(true);

                    const response =
                        await fetch(
                            `${import.meta.env.VITE_API_URL}/api/students/${id}/profile`
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        setError(
                            data.message ||
                            "Unable to fetch student"
                        );

                        return;
                    }


                    setStudent(
                        data.student
                    );


                } catch (error) {

                    console.error(error);

                    setError(
                        "Unable to connect to server"
                    );

                } finally {

                    setLoading(false);

                }
            };


        fetchStudentProfile();

    }, [id]);


    const initials = student?.fullName
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

    const activeCourses =
        student?.enrollments?.filter(
            (item) => item.status === "active"
        );

    const history =
        student?.enrollments?.filter(
            (item) => item.status !== "active"
        );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <>
        <title>Student List</title>
      <div className="app">
        <NavBar />
        <main className="main">
          <TopBar />
        <div className="student-profile-page">

            {/* PAGE HEADER */}

            <div className="profile-page-header">

                <div>
                    <h1>Student Profile</h1>

                    <p>
                        View student details, enrollments,
                        and course history.
                    </p>
                </div>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate('/studentList')}
                >
                    ← Back to Students
                </button>

            </div>


            {/* TOP PROFILE AREA */}

            <div className="profile-grid">

                {/* STUDENT CARD */}

                <div className="student-profile-card">

                    <div className="profile-avatar">
                        {initials || "?"}
                    </div>

                    <h2>
                        {student?.fullName}
                    </h2>

                    <span className="profile-student-id">
                        {student?.studentId}
                    </span>

                    <span
                        className={`profile-status ${
                            student?.status === "active"
                                ? "status-active"
                                : "status-inactive"
                        }`}
                    >
                        {student?.status}
                    </span>


                    <div className="profile-divider" />


                    <div className="profile-stat-row">

                        <div>
                            <span>
                                Active Courses
                            </span>

                            <strong>
                                {activeCourses?.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Total Courses
                            </span>

                            <strong>
                                {student?.enrollments?.length}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* CONTACT DETAILS */}

                <div className="profile-details-card">

                    <div className="card-header">
                        <h3>Contact Details</h3>
                    </div>

                    <div className="details-grid">

                        <div className="detail-item">

                            <span className="detail-label">
                                Full Name
                            </span>

                            <strong>
                                {student?.fullName}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span className="detail-label">
                                Student ID
                            </span>

                            <strong>
                                {student?.studentId}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span className="detail-label">
                                Email Address
                            </span>

                            <strong>
                                {student?.email}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span className="detail-label">
                                Phone Number
                            </span>

                            <strong>
                                {student?.phone || "-"}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span className="detail-label">
                                Student Status
                            </span>

                            <span
                                className={`profile-status ${
                                    student?.status === "active"
                                        ? "status-active"
                                        : "status-inactive"
                                }`}
                            >
                                {student?.status}
                            </span>

                        </div>


                        <div className="detail-item">

                            <span className="detail-label">
                                Joined Date
                            </span>

                            <strong>
                                {student?.joinedDate?
                                                    new Date(
                                                                student.joinedDate
                                                            ).toLocaleDateString():''}
                                {/* {formatDate(student?.joinedDate)} */}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ACTIVE ENROLLMENTS */}

            <div className="profile-section-card">

                <div className="section-header">

                    <div>
                        <h3>Current Enrollments</h3>

                        <p>
                            Courses the student is currently enrolled in.
                        </p>
                    </div>

                    <span className="section-count">
                        {activeCourses?.length} Courses
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="profile-table">

                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Course Code</th>
                                <th>Enrollment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {activeCourses?.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="4"
                                        className="empty-row"
                                    >
                                        No active courses.
                                    </td>
                                </tr>

                            ) : (

                                activeCourses?.map(
                                    (enrollment) => (

                                        <tr key={enrollment.course._id}>

                                            <td>

                                                <div className="course-info">

                                                    <div className="course-icon">
                                                        {enrollment.course.coursename
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            enrollment.course.coursename
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                <span className="course-code">
                                                    {
                                                        enrollment.course.coursecode
                                                    }
                                                </span>
                                            </td>


                                            <td>
                                                {enrollment.course.enrollmentDate?
                                                    new Date(
                                                                enrollment.course.enrollmentDate
                                                            ).toLocaleDateString():''}
                                                {/* {formatDate(
                                                    enrollment.course.enrollmentDate
                                                )} */}
                                            </td>


                                            <td>

                                                <span
                                                    className="course-status status-active"
                                                >
                                                    {
                                                        enrollment.course.status
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* COURSE HISTORY */}

            <div className="profile-section-card">

                <div className="section-header">

                    <div>
                        <h3>Course History</h3>

                        <p>
                            Completed, cancelled, or previous enrollments.
                        </p>
                    </div>

                </div>


                <div className="table-wrapper">

                    <table className="profile-table">

                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Course Code</th>
                                <th>Enrollment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {history?.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="4"
                                        className="empty-row"
                                    >
                                        No course history available.
                                    </td>
                                </tr>

                            ) : (

                                history?.map((enrollment) => (

                                    <tr key={enrollment.course._id}>

                                        <td>

                                            <div className="course-info">

                                                <div className="course-icon">
                                                    {enrollment.course.coursename
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {
                                                        enrollment.course.coursename
                                                    }
                                                </strong>

                                            </div>

                                        </td>


                                        <td>
                                            <span className="course-code">
                                                {
                                                    enrollment.course.coursecode
                                                }
                                            </span>
                                        </td>


                                        <td>
                                            {formatDate(
                                                enrollment.course.enrollmentDate
                                            )}
                                        </td>


                                        <td>

                                            <span
                                                className={`course-status ${
                                                    enrollment.course.status ===
                                                    "completed"
                                                        ? "status-completed"
                                                        : "status-cancelled"
                                                }`}
                                            >
                                                {enrollment.course.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
        </main>
      </div>
    </>
    );
};

export default StudentProfile;