import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

import { FiLogOut } from "react-icons/fi";

import {
    LuLayoutGrid,
    LuPanelsTopLeft,
    LuBell,
} from "react-icons/lu";

const DashboardLayout = () => {
    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.auth);

    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                {/* Logo */}
                <div className="dashboard-logo">
                    HK
                </div>

                {/* Navigation */}
                {/* Navigation */}
                <nav className="dashboard-nav">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <LuLayoutGrid />
                        </span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/templates"
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <LuPanelsTopLeft />
                        </span>
                        <span>Templates</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/notifications"
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <LuBell />
                        </span>
                        <span>Notifications</span>
                    </NavLink>
                </nav>

                <div className="dashboard-sidebar-bottom">
                    {/* <button className="dashboard-settings">
                        <span className="dashboard-nav-icon">⚙</span>
                        <span>Settings</span>
                    </button> */}

                    <div className="dashboard-account">
                        <div className="dashboard-user-avatar">
                            {userInitial}
                        </div>

                        <div className="dashboard-user-info">
                            <span className="dashboard-user-name">
                                {user?.name || "User"}
                            </span>

                            <span className="dashboard-user-email">
                                {user?.email || ""}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="dashboard-logout"
                            onClick={() => dispatch(logout())}
                            disabled={loading}
                            aria-label="Logout"
                            title="Logout"
                        >
                            <FiLogOut />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Page content */}
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout; 