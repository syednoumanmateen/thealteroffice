import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImg from "../assets/notfound.png"
import CenterScreen from './CenterScreen';

const NotFound: React.FC = () => {
    return (
        <>
            <CenterScreen>
                <div className='text-center'>
                    <img src={notFoundImg} alt="404" className='mb-3' />
                    <br />
                    <Link to="/"><button className='btn btn-primary'>Back Home</button></Link>
                </div>
            </CenterScreen>
        </>
    );
};

export default NotFound;
