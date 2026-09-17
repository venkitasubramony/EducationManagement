import "./students.css";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import {  useState } from "react";

export function Student() {

   const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    status: ""  
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
        name === "phone"
            ? value.replace(/\D/g, "")
            : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

   
  };

   const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setFile(null);
            setPreview("");
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                selectedFile.type
            )
        ) {

            setError(
                "Only JPG, PNG and WEBP images are allowed"
            );

            e.target.value = "";

            return;
        }


        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Image must be less than 5 MB"
            );

            e.target.value = "";

            return;
        }


        setError("");

        setFile(selectedFile);

        // Optional image preview
        setPreview(URL.createObjectURL(selectedFile));
    };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("studentId", formData.studentId);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("status", formData.status);

      if (file) {
          data.append("photo", file);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addstudent`, {
        method: "POST",
        /* headers: {
          "Content-Type": "application/json",
        }, */
        //body: JSON.stringify(formData),
        body: data
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const result = await response.json();

      console.log("Student created:", result);

      alert("Student added successfully!");

      // Clear form
      setFormData({
        fullName: "",
        studentId: "",
        email: "",
        phone: "",
        status: "" 
      });
      setFile(null);
      setPreview("");

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add student");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <title>Add Student</title>
      <div className="app">
      <NavBar />
      <main className="main">
       
        <TopBar />
      
      <div className="form-container">


        <div className="form-header">
          <h1>Add Student</h1>
          <p>Enter the student's basic information.</p>
        </div>
         {error && (
                <div className="form-error">
                    {error}
                </div>
            )}
        <form onSubmit={handleSubmit}>

          <div className="form-body">


            <div className="form-group">
              <label htmlFor="fullName">
                Full Name <span className="required">*</span>
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>



            <div className="form-group">
              <label htmlFor="studentId">
                Student ID
              </label>

              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={handleChange}
              />
            </div>



            <div className="form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="student@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>



            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength={10}
                placeholder="91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>



            <div className="form-group">
              <label htmlFor="status">
                Student Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* FILE UPLOAD */}

            <div className="form-group">
                <label>
                    Student Photo
                </label>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                />
                <small>
                        JPG, PNG or WEBP.
                        Maximum 5 MB.
                    </small>
            </div>


            {/* PREVIEW */}

            {preview && (
                <div className="image-preview">
                    <img
                        src={preview}
                        alt="Student preview"
                    />
                </div>
            )}

          </div>



          <div className="form-footer">

            <button
              type="reset"
              className="cancel-btn"
               onClick={() =>{

               
                setFormData({
                  fullName: "",
                  studentId: "",
                  email: "",
                  phone: "",
                  status: ""
                });
                setFile(null);
                setPreview("");
                }
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Student"}
            </button>

          </div>

        </form>

      </div>
      </main>
    </div>
    </>
  )

}







