import { useState, useEffect } from "react";
import "./enrollments.css";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import axios from 'axios'

const Enrollments = (props) => {
    const [search, setSearch] = useState("");

    const [enrollments, setEnrollments] = useState([]);


    useEffect(() => {

        const fetchEnrollments = async () => {

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            await fetch(`http://localhost:3000/api/enrollments?${params.toString()}`).then((response) => {
                return response.json();
            })
                .then((data) => {
                    console.log(data)
                    setEnrollments(data);
                });

        }

        fetchEnrollments();

    }, [search])

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this enrollment?"
        );

        if (!confirmed) {
            return;
        }

        const response = await axios.delete(`http://localhost:3000/api/enrollments/${id}`);
        //console.log(response)
        if (response.statusText != 'OK') {
            alert(response.data.message);
            return;
        }
        alert(response.data.message);
        await fetch(`http://localhost:3000/api/enrollments`).then((response) => {
            return response.json();
        })
            .then((data) => {
                console.log(data)
                setEnrollments(data);
            });
    };
    return (
        <>


            <title>Enrollments</title>
            <div className="app">
                <NavBar />
                <main className="main">
                     <TopBar />
                    <div className="enrollments-page">

                        {/* PAGE HEADER */}

                        <div className="page-header">

                            <div>
                                <h1>Enrollments</h1>

                                <p>
                                    Manage student course enrollments.
                                </p>
                            </div>

                            <button className="add-enrollment-btn" onClick={props.addEnrollment}>
                                + Add Enrollment
                            </button>

                        </div>


                        {/* SEARCH */}

                        <div className="enrollment-toolbar">

                            {/* <div className="enrollment-search"> */}

                            {/* <span className="search-icon">
                                🔍
                            </span> */}

                            <input
                                type="text"
                                placeholder="Search by student name, ID or course..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {/* </div> */}

                        </div>


                        {/* TABLE */}

                        <div className="enrollments-table-card">

                            <div className="table-wrapper">

                                <table className="enrollments-table">

                                    <thead>

                                        <tr>

                                            <th>Student</th>

                                            <th>Student Code</th>

                                            <th>Course</th>

                                            <th>Enrollment Date</th>

                                            <th>Status</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {enrollments.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="no-enrollments"
                                                >
                                                    No enrollments found.
                                                </td>

                                            </tr>

                                        ) : (

                                            enrollments.map(
                                                (enrollment) => (

                                                    <tr key={enrollment._id}>

                                                        {/* STUDENT */}

                                                        <td>

                                                            <div className="student-info">

                                                                <div className="student-avatar">

                                                                    {enrollment.student?.fullName
                                                                        ? enrollment.student?.fullName
                                                                            .trim()
                                                                            .split(/\s+/)
                                                                            .slice(0, 2)
                                                                            .map(
                                                                                (name) =>
                                                                                    name[0]
                                                                            )
                                                                            .join("")
                                                                            .toUpperCase()
                                                                        : "?"}

                                                                </div>

                                                                <div className="student-name">
                                                                    {enrollment.student?.fullName}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* STUDENT ID */}

                                                        <td>
                                                            <span className="student-id">
                                                                {enrollment.student?.studentId}
                                                            </span>
                                                        </td>

                                                        {/* COURSE */}

                                                        <td>
                                                            <span className="course-name">
                                                                {enrollment.course?.coursename}
                                                            </span>
                                                        </td>


                                                        {/* DATE */}

                                                        <td>
                                                            {new Date(
                                                                enrollment.enrollmentDate
                                                            ).toLocaleDateString()}
                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={`enrollment-status ${enrollment.status ===
                                                                    "Active"
                                                                    ? "status-active"
                                                                    : "status-inactive"
                                                                    }`}
                                                            >
                                                                {enrollment.status}
                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td>

                                                            <div className="enrollment-actions">

                                                                {/* <button
                                                                    className="edit-btn"
                                                                >
                                                                    Edit
                                                                </button> */}

                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            enrollment._id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )

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

export default Enrollments;