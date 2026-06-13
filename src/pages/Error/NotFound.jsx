import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => {
      setCounter(prev => prev - 1);
    }, 1000);
    
    if (counter === 0) {
      navigate(-1);
    }
    
    return () => clearInterval(timer);
  }, [counter, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the page you were looking for. It might have been removed, 
          renamed, or didn't exist in the first place.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-500 hover:bg-legpro-primary text-white font-medium rounded transition-colors duration-200"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          Redirecting to home page in {counter} second{counter !== 1 ? "s" : ""}...
        </div>
      </div>
    </div>
  );
};

export default NotFound;