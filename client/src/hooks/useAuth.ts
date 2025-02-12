import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/feature/authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    // Token expired
                    dispatch(logout());
                    navigate("/auth/login"); // Redirect to login page
                }
            } catch (error) {
                console.error("Invalid token:", error);
                dispatch(logout());
                navigate("/auth/login"); // Redirect to login page
            }
        } else {
            navigate("/auth/login"); // If no token, force login
        }
    }, [token, navigate, dispatch]);
};

export default useAuth;
