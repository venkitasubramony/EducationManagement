import { useState } from "react";
import { useNavigate, useLocation  } from "react-router";
function TopBar() {

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const handleLogout = () => {

        // Remove login token
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Close dropdown
        setShowProfileMenu(false);

        // Redirect to login page
        navigate("/");
    };

    const location = useLocation();

    const getPageTitle = () => {

        const path = location.pathname;


        if (path === "/dashboard") {
            return "Dashboard";
        }

        if (path === "/students") {
            return "Students";
        }

        if (path === "/students/add") {
            return "Add Student";
        }

        if (path.startsWith("/studentProfile/")) {
            return "Student Profile";
        }

        if (path === "/courses") {
            return "Courses";
        }

        if (path === "/courses/add") {
            return "Add Course";
        }

        if (path.startsWith("/courses/")) {
            return "Course Details";
        }

        if (path === "/enrollments") {
            return "Enrollments";
        }

        return "Dashboard";
    };

    return (
        <header className="topbar">

            <div className="page-title">
                {getPageTitle()}
            </div>

            <div className="top-actions">

                <div className="notification">🔔</div>

                {/* PROFILE */}

                <div className="profile-wrapper">

                    <div
                        className="profile"
                        onClick={() =>
                            setShowProfileMenu(
                                !showProfileMenu
                            )
                        }
                    >

                        <div className="avatar">
                            {user?.email
                                ?.substring(0, 2)
                                .toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <strong>
                                {user?.email}
                            </strong>

                            <span>
                                {user?.role}
                            </span>

                        </div>

                        <span
                            className={`profile-arrow ${showProfileMenu
                                    ? "profile-arrow-open"
                                    : ""
                                }`}
                        >
                            ▼
                        </span>

                    </div>


                    {/* DROPDOWN */}

                    {showProfileMenu && (

                        <div className="profile-dropdown">

                            <div className="dropdown-user">

                                <strong>
                                    {user?.email}
                                </strong>

                                <span>
                                    {user?.role}
                                </span>

                            </div>


                            <div className="dropdown-divider" />


                            <button
                                type="button"
                                className="logout-menu-btn"
                                onClick={handleLogout}
                            >
                                <span className="logout-icon">
                                    ↪
                                </span>

                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    )
}
export default TopBar;
