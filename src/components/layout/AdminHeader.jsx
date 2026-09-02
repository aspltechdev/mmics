import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          👤 {user?.name || 'Admin'}
        </span>
        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
          {user?.role || 'User'}
        </span>
      </div>
    </header>
  );
};

export default AdminHeader;