import ProtectedRoute from './protectedRoute';
import Dashboard from './dashboard';
import {Student} from './students';
import {Courses} from './courses';
import {AddCourse} from './addCourse';
import Students from './studentsList';
import Enrollments from './enrollments';
import {AddEnrollment} from './addEnrollment'
import Auth from "./auth";
import { Routes, Route, useNavigate } from "react-router";

function App() {
   const navigate = useNavigate();
    const addStudent = ()=>{
        navigate('/addStudent');
    }

    const addEnrollment = ()=>{
        navigate('/addEnrollment');
    }
  return (

    <Routes>
      <Route path="/" element={<Auth />} />
     
      <Route path="dashboard" element={ <ProtectedRoute><Dashboard addStudent={addStudent}/> </ProtectedRoute>} />
     
      <Route path="addStudent" element={<ProtectedRoute><Student /></ProtectedRoute>} />      
      <Route path="courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="addcourse" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
      <Route path="studentList" element={<ProtectedRoute><Students addStudent={addStudent}/></ProtectedRoute>} />
      <Route path="enrollments" element={<ProtectedRoute><Enrollments addEnrollment={addEnrollment}/></ProtectedRoute>} />
      <Route path="addEnrollment" element={<ProtectedRoute><AddEnrollment /></ProtectedRoute>} />
    </Routes>
  )
}
export default App;