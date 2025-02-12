import { memo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../Navbar";
import useScreenSize from "../../hooks/useScreenSize";

const PrivateLayout = () => {
    useAuth(); // Check token validity

    const token = useSelector((state: any) => state.auth.token);
    const isMobile = useScreenSize();

    return token ? (
        <>
            <div className="mb-3">
                <Navbar />
            </div>
            <div className={isMobile ? "" : "p-3"}>
                <Outlet />
            </div>
        </>
    ) : (
        <Navigate to="/auth/login" replace /> //Fixed the path
    );
};

export default memo(PrivateLayout);
