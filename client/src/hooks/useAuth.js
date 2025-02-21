import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../redux/feature/authSlice";

const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    // Token expired
                    dispatch(logout());
                    navigate("/auth/login"); // Redirect to login page
                }
            } catch (e) {
                dispatch(logout());
                navigate("/auth/login"); // Redirect to login page
            }
        }
    }, [token, navigate, dispatch]);
};

export default useAuth;
