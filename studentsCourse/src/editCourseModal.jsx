const EditCourseModal = ({
    course,
    isOpen,
    onClose,
    onUpdate,
    editFormData,
    setEditFormData
}
) => {
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        onUpdate({
            ...editFormData,
            _id: course._id,
        });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                {/* HEADER */}

                <div className="modal-header">

                    <div>
                        <h2>Edit Course</h2>

                        <p>
                            Update the course information below.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                </div>


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="modal-body">

                        <div className="form-grid">

                            {/* COURSE NAME */}

                            <div className="form-group full">

                                <label htmlFor="coursename">
                                    Course Name
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    id="coursename"
                                    name="coursename"
                                    value={editFormData.coursename}
                                    onChange={handleChange}
                                    placeholder="Enter course name"
                                    required
                                />

                            </div>


                            {/* COURSE CODE */}

                            <div className="form-group">

                                <label htmlFor="coursecode">
                                    Course Code
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    id="coursecode"
                                    name="coursecode"
                                    value={editFormData.coursecode}
                                    onChange={handleChange}
                                    placeholder="e.g. WEB-101"
                                    required
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div className="form-group">

                                <label htmlFor="department">
                                    Department
                                    <span className="required">*</span>
                                </label>

                                <select
                                    id="department"
                                    name="department"
                                    value={editFormData.department}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select department
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

                                    <option value="Business Administration">
                                        Business Administration
                                    </option>

                                </select>

                            </div>


                            {/* DURATION */}

                            <div className="form-group">

                                <label htmlFor="duration">
                                    Duration
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={editFormData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. 12 Weeks"
                                    required
                                />

                            </div>


                            {/* MAXIMUM STUDENTS */}

                            <div className="form-group">

                                <label htmlFor="capacity">
                                    Maximum Students
                                </label>

                                <input
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    value={editFormData.capacity}
                                    onChange={handleChange}
                                    placeholder="e.g. 50"
                                    min="1"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group full">

                                <label htmlFor="description">
                                    Course Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleChange}
                                    placeholder="Enter course description..."
                                />

                            </div>


                            {/* STATUS */}

                            <div className="form-group">

                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleChange}
                                >

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


                    {/* FOOTER */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="update-btn"
                        >
                            Update Course
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditCourseModal;