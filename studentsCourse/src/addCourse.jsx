import "./addCourse.css";
import NavBar from './components/nav';
import TopBar from './components/topBar';
import { useState } from "react";
export function AddCourse() {

    const [formData, setFormData] = useState({
        coursename: "",
        coursecode: "",
        department: "",
        duration: "",
        description: "",
        capacity: "",
        status: "active"

    });

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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addcourse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create course");
            }

            const result = await response.json();

            console.log("Course created:", result);

            alert("Course added successfully!");

            // Clear form
            setFormData({
                coursename: "",
                coursecode: "",
                department: "",
                duration: "",
                description: "",
                capacity: "",
                status: "active"
            });

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add student");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>

            <title>Add Course</title>

            <div className="app">
                <NavBar />
                <main className="main">
                    <TopBar />

                    <div className="form-container">



                        <div className="form-header">

                            <h1>Add Course</h1>

                            <p>
                                Create a new course for students.
                            </p>

                        </div>




                        <form onSubmit={handleSubmit}>

                            <div className="form-body">

                                <div className="section">

                                    <div className="section-title">
                                        Course Information
                                    </div>

                                    <div className="form-grid">


                                        <div className="form-group full">

                                            <label>
                                                Course Name
                                                <span className="required">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                name="coursename"
                                                placeholder="Enter course name"
                                                value={formData.coursename}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>



                                        <div className="form-group">

                                            <label>
                                                Course Code
                                                <span className="required">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                name="coursecode"
                                                placeholder="e.g. WEB-101"
                                                value={formData.coursecode}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>




                                        <div className="form-group">

                                            <label>
                                                Department
                                                <span className="required">*</span>
                                            </label>

                                            <select name="department" required value={formData.department} onChange={handleChange}>

                                                <option value="">
                                                    Select department
                                                </option>

                                                <option>
                                                    Computer Science
                                                </option>

                                                <option>
                                                    Information Technology
                                                </option>

                                                <option>
                                                    Data Science
                                                </option>

                                                <option>
                                                    Design
                                                </option>

                                                <option>
                                                    Business Administration
                                                </option>

                                            </select>

                                        </div>



                                        <div className="form-group">

                                            <label>
                                                Duration
                                                <span className="required">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                name="duration"
                                                placeholder="e.g. 12 Weeks"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>



                                        <div className="form-group">

                                            <label>
                                                Maximum Students
                                            </label>

                                            <input
                                                type="number"
                                                name="capacity"
                                                placeholder="e.g. 50"
                                                value={formData.capacity}
                                                min="1" onChange={handleChange}
                                            />

                                        </div>

                                    </div>

                                </div>



                                <div className="section">

                                    <div className="section-title">
                                        Description
                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Course Description
                                        </label>

                                        <textarea
                                            name="description"
                                            placeholder="Enter course description..." value={formData.description} onChange={handleChange}
                                        ></textarea>

                                    </div>

                                </div>




                                <div className="section">

                                    <div className="section-title">
                                        Course Status
                                    </div>

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

                                        </select>

                                    </div>

                                </div>

                            </div>




                            <div className="form-footer">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setFormData({
                                        coursename: "",
                                        coursecode: "",
                                        department: "",
                                        duration: "",
                                        description: "",
                                        capacity: "",
                                        status: "active"
                                    })}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn" disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Course"}
                                </button>

                            </div>

                        </form>

                    </div>

                </main>
            </div>

        </>

    )


}


