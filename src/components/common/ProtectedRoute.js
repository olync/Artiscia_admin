import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../auth/Login';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Admin Panel...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Login />;
};

export default ProtectedRoute;
