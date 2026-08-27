const EditStudentModal = ({
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
                        <h2>Edit Student</h2>

                        <p>
                            Update the student information below.
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

                                <label htmlFor="fullName">
                                    Student Name
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={editFormData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter student name"
                                    required
                                />

                            </div>


                            {/* Email */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. test@test.com"
                                    required
                                />

                            </div>

                            {/* PHONE */}

                            <div className="form-group">

                                <label htmlFor="phone">
                                    Phone
                                    <span className="required">*</span>
                                </label>

                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleChange}
                                    placeholder="91 XXXXX XXXXX"
                                    required
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
                            Update Student
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditStudentModal;