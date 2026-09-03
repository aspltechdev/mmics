import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {greeting}, {user?.name || 'Member'}! 👋
        </h2>
        <p className="text-gray-600">Welcome to your member dashboard</p>
      </div>

      {/* Member Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Name</p>
              <p className="text-lg font-semibold text-gray-800">{user?.name || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
              ✉️
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl">
              🏷️
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Welcome to MMMICS Member Portal</h3>
        <p className="text-blue-100">
          You are now logged in as a registered member. Your membership details are available here.
        </p>
        <div className="mt-4 flex gap-3">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
            View Profile
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;