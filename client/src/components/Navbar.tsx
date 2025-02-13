import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/feature/authSlice";
import { Link } from "react-router-dom";
import useScreenSize from "../hooks/useScreenSize";

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);
    const isMobile = useScreenSize();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold theme-color" to="/">TaskBuddy</Link>
                <div className="ms-auto">
                    <button className="btn btn-outline-dark ms-auto" onClick={handleLogout}>  <div className="overflow-auto" style={{ width: `${isMobile ? "100px" : ""}`, height: "20px" }}>Logout from {user?.name || "Guest"}</div></button>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
