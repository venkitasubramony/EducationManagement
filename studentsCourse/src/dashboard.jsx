import NavBar from './components/nav'
import TopBar from './components/topBar'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
function Dashboard(props) {
    const navigate = useNavigate();
    const studentList = ()=> navigate('/studentList');

    const courseList = ()=> navigate('/courses');

    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        totalEnrollments: 0,
        completionRate: 0
    });

    const [loading, setLoading] = useState(true);

    const [popularCourses, setPopularCourses] =
        useState([]);

    const [popularLoading, setPopularLoading] =
        useState(true);


    useEffect(() => {

        fetch("http://localhost:3000/api/students?recent=true").then((response) => {
            return response.json();
        })
            .then((data) => {
                //console.log(data)
                setStudents(data);
            });

        const fetchDashboardStats = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/api/dashboard/stats"

                );


                if (!response.ok) {

                    if (response.status === 401) {

                        return;
                    }

                    throw new Error(
                        "Failed to load dashboard statistics"
                    );
                }


                const data = await response.json();

                setStats(data);


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardStats();


        const fetchPopularCourses = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/api/dashboard/popular-courses"
                );


                if (!response.ok) {
                    throw new Error(
                        "Failed to load popular courses"
                    );
                }


                const data =
                    await response.json();


                setPopularCourses(
                    data.popularCourses
                );


            } catch (error) {

                console.error(
                    "Popular courses error:",
                    error
                );

            } finally {

                setPopularLoading(false);

            }

        };


        fetchPopularCourses();

    }, []);

    return (
        <>
            <title>EduManage - Student & Courses</title>
            <div className="app">
                <NavBar />
                <main className="main">
                    <TopBar />


                    <section className="content">


                        <div className="welcome">

                            <div>
                                <h1>Good afternoon, John 👋</h1>
                                <p>Here's what's happening with your students and courses.</p>
                            </div>

                            <button className="btn" onClick={props.addStudent}>
                                + Add Student
                            </button>

                        </div>



                        <div className="stats">

                            <div className="stat-card">
                                <div className="stat-top">
                                    <div>
                                        <div className="stat-label">Total Students</div>
                                        <div className="stat-value">{loading
                                            ? "..."
                                            : stats.totalStudents}</div>
                                    </div>

                                    <div className="stat-icon">👨‍🎓</div>
                                </div>

                                {/* <div className="growth">↑ 12.5% this month</div> */}
                            </div>


                            <div className="stat-card">
                                <div className="stat-top">
                                    <div>
                                        <div className="stat-label">Active Courses</div>
                                        <div className="stat-value">{loading
                                            ? "..."
                                            : stats.activeCourses}</div>
                                    </div>

                                    <div className="stat-icon">📚</div>
                                </div>

                                {/* <div className="growth">↑ 4 new courses</div> */}
                            </div>


                            <div className="stat-card">
                                <div className="stat-top">
                                    <div>
                                        <div className="stat-label">Enrollments</div>
                                        <div className="stat-value">{loading
                                            ? "..."
                                            : stats.totalEnrollments}</div>
                                    </div>

                                    <div className="stat-icon">🔗</div>
                                </div>

                                {/* <div className="growth">↑ 8.2% this month</div> */}
                            </div>


                            <div className="stat-card">
                                <div className="stat-top">
                                    <div>
                                        <div className="stat-label">Completion Rate</div>
                                        <div className="stat-value">{loading
                                            ? "..."
                                            : `${stats.completionRate}%`}</div>
                                    </div>

                                    <div className="stat-icon">✓</div>
                                </div>

                                {/* <div className="growth">↑ 3.4% this month</div> */}
                            </div>

                        </div>



                        <div className="dashboard-grid">



                            <div className="panel">

                                <div className="panel-header">
                                    <h2>Recent Students</h2>
                                    <span className="view-all" onClick={studentList}>View all →</span>
                                </div>

                                <div className="table-container">

                                    <table>

                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Course</th>
                                                <th>Joined</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {students && students.map((student) =>
                                            (
                                                <tr key={student.studentId}>
                                                    <td>
                                                        <div className="student">
                                                            <div className="student-avatar"> {student.fullName
                                                                .trim()
                                                                .split(" ")
                                                                .slice(0, 2)
                                                                .map((name) => name.charAt(0))
                                                                .join("")
                                                                .toUpperCase()}</div>
                                                            <div>
                                                                <div className="student-name">{student.fullName}</div>
                                                                <div className="student-email">{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>{student.courseNames?.length > 0
        ? student.courseNames.join(", ")
        : "Not Assigned"}</td>
                                                    <td>{student.joinedDate?
                                                    new Date(
                                                                student.joinedDate
                                                            ).toLocaleDateString():''}</td>

                                                    <td>
                                                        <span className={`badge ${student.status}`}>{student.status}</span>
                                                    </td>
                                                </tr>
                                            )
                                            )}



                                        </tbody>

                                    </table>

                                </div>

                            </div>


                            <div className="panel">

                                <div className="panel-header">
                                    <h2>Popular Courses</h2>
                                    <span className="view-all" onClick={courseList}>View all →</span>
                                </div>

                                {popularLoading ? (

                                    <p>
                                        Loading courses...
                                    </p>

                                ) : popularCourses.length === 0 ? (

                                    <p>
                                        No course enrollment data available.
                                    </p>

                                ) : (

                                    popularCourses.map((course) => {

                                        const percentage =
                                            course.capacity > 0
                                                ? Math.min(
                                                    100,
                                                    Math.round(
                                                        (
                                                            course.studentCount /
                                                            course.capacity
                                                        ) * 100
                                                    )
                                                )
                                                : 0;


                                        return (
                                            <div className="course" key={course.courseId}>

                                                <div className="course-top">
                                                    <div>
                                                        <div className="course-name">
                                                            {course.coursename}
                                                        </div>

                                                        <div className="course-code">
                                                            {course.coursecode}
                                                        </div>
                                                    </div>

                                                    <strong>{percentage}%</strong>
                                                </div>

                                                <div className="progress">
                                                    <div className="progress-bar" style={{ "width": `${percentage}%` }}></div>
                                                </div>

                                                <div className="course-meta">
                                                    <span> {course.studentCount}
                                                        {" "} students</span>
                                                    <span>{percentage}%
                                                        {" "} capacity</span>
                                                </div>

                                            </div>
                                        );
                                    })

                                )}




                            </div>


                        </div>

                    </section>
                </main>
            </div>
        </>
    )
}
export default Dashboard;