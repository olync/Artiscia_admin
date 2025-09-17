import React from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from './layout/AdminLayout';
import Login from './common/Login';

const AppContent = () => {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AdminLayout /> : <Login />;
};

export default AppContent;
