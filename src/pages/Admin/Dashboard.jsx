import React, { useState, useEffect } from 'react';
import { productAPI, enquiryAPI, contactAPI, directorAPI, galleryAPI, newsAPI } from '../../services/api';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    enquiries: 0,
    contacts: 0,
    directors: 0,
    gallery: 0,
    news: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, enquiries, contacts, directors, gallery, news] = await Promise.all([
          productAPI.getAll({ limit: 100 }),
          enquiryAPI.getAll({ limit: 100 }),
          contactAPI.getAll({ limit: 100 }),
          directorAPI.getAll(),
          galleryAPI.getAll(),
          newsAPI.getAll({ limit: 100 }),
        ]);

        setStats({
          products: products.data?.length || 0,
          enquiries: enquiries.data?.length || 0,
          contacts: contacts.data?.length || 0,
          directors: directors.length || 0,
          gallery: gallery.length || 0,
          news: news.data?.length || 0,
        });

        // Get recent enquiries
        const recent = enquiries.data?.slice(0, 5) || [];
        setRecentEnquiries(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Products', value: stats.products, color: 'blue', icon: '📦' },
    { label: 'Total Enquiries', value: stats.enquiries, color: 'green', icon: '✉️' },
    { label: 'Contact Messages', value: stats.contacts, color: 'yellow', icon: '💬' },
    { label: 'Directors', value: stats.directors, color: 'purple', icon: '👤' },
    { label: 'Gallery Images', value: stats.gallery, color: 'pink', icon: '🖼️' },
    { label: 'News Articles', value: stats.news, color: 'indigo', icon: '📰' },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${colorClasses[card.color]} text-white p-3 rounded-full text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Enquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No enquiries yet
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enquiry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.product?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        enquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                        enquiry.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                        enquiry.status === 'QUOTED' ? 'bg-green-100 text-green-800' :
                        enquiry.status === 'CONVERTED' ? 'bg-teal-100 text-teal-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {enquiry.status || 'NEW'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;