import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { path: '/admin/enquiries', label: 'Enquiries', icon: '✉️' },
    { path: '/admin/contact', label: 'Contact Messages', icon: '💬' },
    { path: '/admin/directors', label: 'Directors', icon: '👤' },
    { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/admin/news', label: 'News', icon: '📰' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    // In menuItems array, add:

    // Add this to menuItems
{ path: '/admin/hero', label: 'Hero Section', icon: '🎯' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="brand">
        <h2>MMMICS</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="nav-menu">
        <div className="nav-label">Main Menu</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div className="info">
            <div className="name">{user?.name || 'Admin'}</div>
            <div className="role">{user?.role || 'User'}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;