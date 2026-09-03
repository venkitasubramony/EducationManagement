import "./studentsList.css";
import "./pagination.css";
import NavBar from './components/nav'
import TopBar from './components/topBar'
import { useState, useEffect } from "react";
import EditStudentModal from './editStudentModal';
import axios from "axios";

const Students = (props) => {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  //const [courseFilter, setCourseFilter] = useState("all");

  // Sample data
  const [students, setStudents] = useState([]);



  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", pageSize);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      await fetch(`${import.meta.env.VITE_API_URL}/api/students?${params.toString()}`).then((response) => {
        return response.json();
      })
        .then((data) => {
          //console.log(data)
          setStudents(data.Students);
          setPagination(data.pagination);
        });

    }
    if (search || statusFilter) {


      const timer = setTimeout(() => {
        fetchStudents();
      }, 400);


      return () => {
        clearTimeout(timer);
      };

    }
    else {
      fetchStudents();
    }

  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "active",
  });

  const handleEdit = (student) => {

    setSelectedStudent(student);
    setEditFormData({
      fullName: student.fullName || "",
      email: student.email || "",
      phone: student.phone || "",
      status: student.status || "active",
    });
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleUpdate = async (updatedStudent) => {

    // API call goes here
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/students/${updatedStudent._id}`, updatedStudent);
    console.log(response)
    if (response.statusText != 'OK') {
      alert(response.data);
      return;
    }
    alert(response.data);
    handleClose();
    await fetch(`${import.meta.env.VITE_API_URL}/api/students`).then((response) => {
      return response.json();
    })
      .then((data) => {

        setStudents(data);
      });
  };

  const handleDelete = async (studentId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/students/${studentId}`);
    console.log(response)
    if (response.statusText != 'OK') {
      alert(response.data.message);
      return;
    }
    alert(response.data.message);
  };


  return (
    <>


      <title>Student List</title>
      <div className="app">
        <NavBar />
        <main className="main">
          <TopBar />
          <div className="students-page">

            {/* PAGE HEADER */}

            <div className="page-header">

              <div>
                <h1>Students</h1>

                <p>
                  Manage students and their course enrollments.
                </p>
              </div>


              <button className="add-student-btn" onClick={props.addStudent}>
                + Add Student
              </button>

            </div>


            {/* FILTER TOOLBAR */}

            <div className="students-toolbar">

              {/* SEARCH */}

              {/* <div className="student-search"> 

                <span className="search-icon">
                  🔍
                </span>
*/}
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {/* </div> */}


              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>


              {/* COURSE */}
              {/* 
              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(e.target.value)
                }
              >

                <option value="all">
                  All Courses
                </option>

                <option value="Full Stack Development">
                  Full Stack Development
                </option>

                <option value="UI/UX Design">
                  UI/UX Design
                </option>

                <option value="Python Programming">
                  Python Programming
                </option>

              </select>
*/}
            </div>


            {/* STUDENTS TABLE */}

            <div className="students-table-card">

              <div className="table-wrapper">

                <table className="students-table">

                  <thead>

                    <tr>

                      <th>Student</th>

                      <th>Student ID</th>

                      <th>Email</th>

                      <th>Phone Number</th>

                      <th>Course</th>

                      <th>Status</th>

                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody>

                    {students.length === 0 ? (

                      <tr>

                        <td
                          colSpan="7"
                          className="no-students"
                        >
                          No students found.
                        </td>

                      </tr>

                    ) : (

                      students.map((student) => (

                        <tr key={student._id}>

                          {/* STUDENT */}

                          <td>

                            <div className="student-info">

                              <div className="student-avatar">

                                {student.fullName
                                  .trim()
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((name) => name.charAt(0))
                                  .join("")
                                  .toUpperCase()}

                              </div>


                              <div>

                                <div className="student-name">
                                  {student.fullName}
                                </div>

                              </div>

                            </div>

                          </td>


                          {/* STUDENT ID */}

                          <td>

                            <span className="student-id">
                              {student.studentId}
                            </span>

                          </td>


                          {/* EMAIL */}

                          <td>

                            <span className="student-email">
                              {student.email}
                            </span>

                          </td>


                          {/* PHONE */}

                          <td>
                            {student.phone}
                          </td>


                          {/* COURSE */}

                          <td>

                            {student.course ? (

                              <span className="course-name">
                                {student.course}
                              </span>

                            ) : (

                              <span className="no-course">
                                Not Assigned
                              </span>

                            )}

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`student-status ${student.status === "active"
                                ? "status-active"
                                : "status-inactive"
                                }`}
                            >

                              {student.status}

                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td>

                            <div className="student-actions">

                              <button
                                className="edit-student-btn"
                                onClick={() =>
                                  handleEdit(student)
                                }
                              >
                                Edit
                              </button>


                              <button
                                className="delete-student-btn"
                                onClick={() =>
                                  handleDelete(
                                    student._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>


                <div className="pagination">

                  <div className="pagination-info">
                    Showing page{" "}
                    <strong>
                      {pagination.currentPage}
                    </strong>
                    {" "}of{" "}
                    <strong>
                      {pagination.totalPages}
                    </strong>

                    <span>
                      {" "}({pagination.totalStudents} students)
                    </span>
                  </div>


                  <div className="pagination-actions">

                    <button
                      type="button"
                      disabled={
                        !pagination.hasPreviousPage
                      }
                      onClick={() =>
                        setPage((prev) => prev - 1)
                      }
                    >
                      Previous
                    </button>


                    {Array.from(
                      {
                        length:
                          pagination.totalPages
                      },
                      (_, index) => index + 1
                    ).map((pageNumber) => (

                      <button
                        type="button"
                        key={pageNumber}
                        className={
                          pageNumber ===
                            pagination.currentPage
                            ? "active-page"
                            : ""
                        }
                        onClick={() =>
                          setPage(pageNumber)
                        }
                      >
                        {pageNumber}
                      </button>

                    ))}


                    <button
                      type="button"
                      disabled={
                        !pagination.hasNextPage
                      }
                      onClick={() =>
                        setPage((prev) => prev + 1)
                      }
                    >
                      Next
                    </button>

                  </div>

                </div>
                {/* Pagination completes */}
              </div>

            </div>
            <EditStudentModal
              course={selectedStudent}
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
  );
};

export default Students;







