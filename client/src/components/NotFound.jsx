import React from 'react';
import { Link } from 'react-router-dom';
import CenterScreen from './CenterScreen';

const NotFound = () => {
    return (
        <CenterScreen>
            <section className="text-center">
                <img src="https://res.cloudinary.com/dz4lki63f/image/upload/v1739528732/notfound_on3era.png" alt="Page not found" className="mb-3" />
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
