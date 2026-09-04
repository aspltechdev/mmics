import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <div className="admin-header">
      <h1>Dashboard</h1>
      <div className="right">
        <span className="name">{user?.name || 'Admin'}</span>
        <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
      </div>
    </div>
  );
};

export default AdminHeader;