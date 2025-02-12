import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/feature/authSlice";
import { Link } from "react-router-dom";
import useScreenSize from "../hooks/useScreenSize";
import { useState } from "react";

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);
    const isMobile = useScreenSize();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-primary" to="/">TaskBuddy</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className={`navbar-nav ms-auto border rounded ${isMobile ? "w-50" : ""} overflow-hidden`}>
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle border-0 bg-transparent d-flex align-items-center"
                                id="userDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <img
                                    src="./src/assets/logo.png"
                                    alt="User"
                                    className="rounded-circle me-2"
                                    width="30"
                                    height="30"
                                />
                                {user?.name || "Guest"}
                            </button>

                            <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`}>
                                <li>
                                    {/* <Link className="dropdown-item" to="/profile">Profile</Link> */}
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
