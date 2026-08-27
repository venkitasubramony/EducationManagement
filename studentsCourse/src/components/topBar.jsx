import { useState } from "react";
import { useNavigate } from "react-router";
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

    return (
        <header className="topbar">

            <div className="page-title">
                Dashboard
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
