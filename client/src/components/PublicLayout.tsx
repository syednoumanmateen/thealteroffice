import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import CenterScreen from './CenterScreen';
import { memo } from 'react';

const PublicLayout = () => {
    const pathSegments = window.location.pathname.split("/");
    const name = pathSegments.filter(segment => segment).pop()?.replace(/^\w/, (c) => c.toUpperCase());

    // redux
    const { isAuthenticated } = useSelector((state: any) => state.auth)

    return (
        <>
            {isAuthenticated ? <Navigate to="/" /> :
                <CenterScreen style={{ height: "100vh" }}>
                    <div className="border rounded p-5 bg-white">
                        <Outlet />
                    </div>
                </CenterScreen>
            }
        </>
    )
}

export default memo(PublicLayout)
