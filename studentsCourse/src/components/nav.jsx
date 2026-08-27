import { Link } from "react-router";

function NavBar() {
   
    return (
        /* SIDEBAR */
        <aside className="sidebar">

            <div className="logo">
                <div className="logo-icon">E</div>
                <span>EduManage</span>
            </div>

            <div className="menu-title">Main Menu</div>
            
            <div className="nav-item active">
                <div className="nav-icon">⌂</div>
                <Link to="/dashboard">
                <span>Dashboard</span>
                </Link>
            </div>

            <div className="nav-item">
                <div className="nav-icon">👨‍🎓</div>
                <Link to="/studentList"><span >Students</span></Link>
            </div>

            <div className="nav-item">
                <div className="nav-icon">📚</div>
                <Link to="/courses">
                <span>Courses</span>
                </Link>
            </div>

            <div className="nav-item">
                <div className="nav-icon">🔗</div>
                <Link to="/enrollments">
                <span>Enrollments</span>
                </Link>
            </div>
{/* 
            <div className="menu-title">Management</div>

            <div className="nav-item">
                <div className="nav-icon">👨‍🏫</div>
                <span>Instructors</span>
            </div>

            <div className="nav-item">
                <div className="nav-icon">📊</div>
                <span>Reports</span>
            </div>

            <div className="nav-item">
                <div className="nav-icon">⚙</div>
                <span>Settings</span>
            </div>
 */}
        </aside>
    )
}

export default NavBar;