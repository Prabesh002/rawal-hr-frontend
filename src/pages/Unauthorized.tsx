import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-amber-500 mb-4">401</h1>
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Unauthorized Access</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page. Please log in with appropriate credentials.
        </p>
        <Link 
          to="/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-4"
        >
          Login
        </Link>
        <Link 
          to="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;