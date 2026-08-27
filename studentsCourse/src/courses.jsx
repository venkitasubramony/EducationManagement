import "./courses.css";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import { Link } from "react-router";
import EditCourseModal from './editCourseModal'
import { useState, useEffect } from "react";
import axios from "axios";

export function Courses() {

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [departmentFilter, setDepartmentFilter] = useState("all");


    useEffect(() => {

        const fetchCourses = async () => {
            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            if (departmentFilter !== "all") {
                params.append(
                    "department",
                    departmentFilter
                );
            }
            await fetch(`http://localhost:3000/api/courses?${params.toString()}`).then((response) => {
                return response.json();
            })
                .then((data) => {
                    //console.log(data)
                    setCourses(data);
                });
        }
        const timer = setTimeout(() => {
            fetchCourses();
        }, 400);


        return () => {
            clearTimeout(timer);
        };

    }, [search, statusFilter, departmentFilter]);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [editFormData, setEditFormData] = useState({
        coursename: "",
        coursecode: "",
        department: "",
        duration: "",
        capacity: "",
        description: "",
        status: "active",
    });

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setEditFormData({
            coursename: course.coursename || "",
            coursecode: course.coursecode || "",
            department: course.department || "",
            duration: course.duration || "",
            capacity: course.capacity || "",
            description: course.description || "",
            status: course.status || "active",
        });
        setShowEditModal(true);
    };

    const handleClose = () => {
        setShowEditModal(false);
        setSelectedCourse(null);
    };

    const handleUpdate = async (updatedCourse) => {

        //console.log("Updated course:", updatedCourse);

        // API call goes here
        const response = await axios.put(`http://localhost:3000/api/courses/${updatedCourse._id}`, updatedCourse);
        console.log(response)
        if (response.statusText != 'OK') {
            alert(response.data);
            return;
        }
        alert(response.data);
        handleClose();
    };
    const handleDelete = async (CourseId) => {
        const response = await axios.delete(`http://localhost:3000/api/courses/${CourseId}`);
        console.log(response)
        if (response.statusText != 'OK') {
            alert(response.data.message);
            return;
        }
        alert(response.data.message);
    };
    return (
        <>
            <title>Courses</title>

            <div className="app">
                <NavBar />
                <main className="main">
                    <TopBar />
                    <div className="container">

                        <div className="page-header">

                            <div>
                                <h1>Courses</h1>
                                <p>Manage all courses available for students.</p>
                            </div>

                            <Link to="/addcourse" className="add-btn">
                                + Add Course
                            </Link>

                        </div>



                        <div className="toolbar">

                            <input
                                type="text"
                                className="search"
                                placeholder="Search courses by name or code..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            <select value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }>
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <select value={departmentFilter}
                                onChange={(e) =>
                                    setDepartmentFilter(e.target.value)
                                }>
                                <option value="all">
                                    All Departments
                                </option>

                                <option value="Computer Science">
                                    Computer Science
                                </option>

                                <option value="Information Technology">
                                    Information Technology
                                </option>

                                <option value="Data Science">
                                    Data Science
                                </option>

                                <option value="Design">
                                    Design
                                </option>
                            </select>

                        </div>



                        <div className="table-card">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Course Code</th>
                                        <th>Department</th>
                                        <th>Duration</th>
                                        <th>Students</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        courses && courses.map((course) => {
                                            return (

                                                <tr key={course._id}>

                                                    <td>
                                                        <div className="course">

                                                            <div className="course-icon">
                                                                FS
                                                            </div>

                                                            <div>
                                                                <div className="course-name">
                                                                    {course.coursename}
                                                                </div>

                                                                <div className="course-description">
                                                                    {course.description}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td className="course-code">
                                                        {course.coursecode}
                                                    </td>

                                                    <td>
                                                        {course.department}
                                                    </td>

                                                    <td>
                                                        {course.duration}
                                                    </td>

                                                    <td>
                                                        {course.capacity}
                                                    </td>

                                                    <td>
                                                        <span className={`badge ${course.status}`}>
                                                            {course.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="actions">

                                                            <button className="action-btn" onClick={() => handleEdit(course)}>
                                                                Edit
                                                            </button>

                                                            <button className="action-btn delete-btn" onClick={() => handleDelete(course._id)}>
                                                                Delete
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>

                                            )

                                        })
                                    }

                                </tbody>

                            </table>

                        </div>

                        <EditCourseModal
                            course={selectedCourse}
                            isOpen={showEditModal}
                            editFormData={editFormData}
                            setEditFormData={setEditFormData}
                            onClose={handleClose}
                            onUpdate={handleUpdate}
                        />

                    </div>
                </main>
            </div>
        </>
    )

}



