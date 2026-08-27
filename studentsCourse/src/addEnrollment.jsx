import "./addCourse.css";
import NavBar from './components/nav';
import TopBar from './components/topBar';
import { useState, useEffect } from "react";
export function AddEnrollment() {

    const [formData, setFormData] = useState({
        studentId: "",
        courseId: "",
        status: "active"

    });

    const [students, setStudents] = useState([]);
    const [courses, setcourses] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/api/students").then((response) => {
            return response.json();
        })
            .then((data) => {

                setStudents(data);
            });

        fetch("http://localhost:3000/api/courses").then((response) => {
            return response.json();
        })
            .then((data) => {

                setcourses(data);
            });

    }, []);

    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch("http://localhost:3000/api/addenrollment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create enrollment");
            }

            const result = await response.json();

            console.log("Enrollment added:", result);

            alert("Enrollment added successfully!");

            // Clear form
            setFormData({
                studentId: "",
                courseId: "",
                status: "active"
            });

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add enrollment");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>

            <title>Add Enrollment</title>

            <div className="app">
                <NavBar />
                <main className="main">
                    <TopBar />

                    <div className="form-container">



                        <div className="form-header">

                            <h1>Add Enrollment</h1>

                            <p>
                                Connect students with courses and manage enrollment status.
                            </p>

                        </div>




                        <form onSubmit={handleSubmit}>

                            <div className="form-body">

                                <div className="section">

                                    <div className="section-title">
                                        New Enrollment
                                    </div>

                                    <div className="form-grid">


                                        <div className="form-group full">

                                            <label>
                                                Course
                                                <span className="required">*</span>
                                            </label>

                                            <select
                                                id="courseId"
                                                name="courseId"
                                                value={formData.courseId}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value="">
                                                    Select course
                                                </option>
                                                { courses && courses.map((course) =>
                                                    (
                                                        <option key={course._id} value={course._id}>
                                                            {course.coursename}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                        </div>


                                        <div className="form-group full">

                                            <label>
                                                Student
                                                <span className="required">*</span>
                                            </label>

                                            <select name="studentId" required value={formData.studentId} onChange={handleChange}>

                                                <option value="">
                                                    Select student
                                                </option>

                                                {students && students.map((student) =>
                                                (
                                                    <option key={student._id} value={student._id}>
                                                        {student.fullName}
                                                    </option>
                                                )
                                                )}

                                            </select>

                                        </div>



                                    </div>

                                </div>


                                <div className="section">

                                    <div className="form-group">

                                        <label>
                                            Status
                                        </label>

                                        <select name="status" value={formData.status} onChange={handleChange}>

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>
                                            <option value="completed">
                                                completed
                                            </option>
                                            <option value="cancelled">
                                                cancelled
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>




                            <div className="form-footer">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setFormData({
                                        studentId: "",
                                        courseId: "",
                                        status: "active"
                                    })}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn" disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Enrollment"}
                                </button>

                            </div>

                        </form>

                    </div>

                </main>
            </div>

        </>

    )


}


