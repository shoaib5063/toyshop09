import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ToyVerse - Page Not Found';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="text-6xl mb-4">🧸</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops! Toy Not Found</h1>
          <p className="text-gray-600 text-lg mb-2">
            The page you're looking for seems to have wandered off to the toy box.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back to playing!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Back to Home
          </Link>
          
          <button
            onClick={() => navigate(-1)}
            className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Need help finding something?</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-500">
              Browse Toys
            </Link>
            <Link to="/profile" className="text-blue-600 hover:text-blue-500">
              My Profile
            </Link>
            <a href="mailto:support@toyverse.com" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
