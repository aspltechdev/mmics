import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();

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
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">MMMICS Admin</h2>
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;