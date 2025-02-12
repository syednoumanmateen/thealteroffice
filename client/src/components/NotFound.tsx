import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImg from "../assets/notfound.png";
import CenterScreen from './CenterScreen';

const NotFound: React.FC = () => {
    return (
        <CenterScreen>
            <section className="text-center">
                <img src={notFoundImg} alt="Page not found" className="mb-3" />
                <h2 className="text-xl font-semibold">Oops! Page Not Found</h2>
                <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
                <Link to="/">
                    <button className="btn btn-primary" aria-label="Go back to home">
                        Back Home
                    </button>
                </Link>
            </section>
        </CenterScreen>
    );
};

export default NotFound;
