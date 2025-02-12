import { memo } from 'react';
import { BiTask } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import CenterScreen from '../CenterScreen';
import useAuth from '../../hooks/useAuth';

const Title = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className='mb-5 text-center'>
                <h1 className='d-flex justify-content-center align-items-center theme-color mb-3'>
                    <div className='me-2'><BiTask /></div>
                    <div className='fs-3'>TaskBuddy</div>
                </h1>
                <div style={{ fontSize: "14px" }}>Streamline your workflow and track progress effortlessly<br /> with our all-in-one task management app.</div>
            </div>
        </div>
    )
}

const PublicLayout = () => {
    const pathSegments = window.location.pathname.split("/");
    const name = pathSegments.filter(segment => segment).pop()?.replace(/^\w/, (c) => c.toUpperCase());
    useAuth(); // Check token validity

    const token = useSelector((state: any) => state.auth.token);

    return (
        <>
            {token ? <Navigate to="/" /> : <CenterScreen>
                <div>
                    <Title />
                    <div className='border rounded bg-white p-5'>
                        <h4 className="mb-3 text-center">{name} Page</h4>
                        <Outlet />
                    </div>
                </div>
            </CenterScreen>}
        </>
    )
}

export default memo(PublicLayout)
