import React, { useState, useEffect } from 'react';
import { productAPI, enquiryAPI, contactAPI, directorAPI, galleryAPI, newsAPI } from '../../services/api';

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
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
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

      const recent = enquiries.data?.slice(0, 5) || [];
      setRecentEnquiries(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total Products', value: stats.products, color: 'blue', icon: '📦', sub: 'Active products' },
    { label: 'Total Enquiries', value: stats.enquiries, color: 'green', icon: '✉️', sub: 'Quote requests' },
    { label: 'Contact Messages', value: stats.contacts, color: 'yellow', icon: '💬', sub: 'From contact form' },
    { label: 'Directors', value: stats.directors, color: 'purple', icon: '👤', sub: 'Board members' },
    { label: 'Gallery Images', value: stats.gallery, color: 'pink', icon: '🖼️', sub: 'In gallery' },
    { label: 'News Articles', value: stats.news, color: 'indigo', icon: '📰', sub: 'Published' },
  ];

  const statusMap = {
    NEW: 'badge-new',
    CONTACTED: 'badge-contacted',
    IN_PROGRESS: 'badge-in-progress',
    QUOTED: 'badge-quoted',
    CONVERTED: 'badge-converted',
    CLOSED: 'badge-closed',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="dash-header">
        <h1>{greeting}! 👋</h1>
        <p>Here's what's happening with your website</p>
      </div>

      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className={`stat-card stat-${card.color}`}>
            <div className="top">
              <div className="icon">{card.icon}</div>
            </div>
            <div className="value">{card.value}</div>
            <div className="label">{card.label}</div>
            <div className="sub">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="head">
          <div>
            <h3>Recent Enquiries</h3>
            <span className="sub">Latest quote requests from customers</span>
          </div>
          <a href="/admin/enquiries" className="link">View all →</a>
        </div>
        <div className="table-wrap">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <span className="icon">📭</span>
                      <p>No enquiries yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{enq.name}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{enq.email}</div>
                    </td>
                    <td>{enq.product?.name || 'Not specified'}</td>
                    <td>
                      <span className={`badge ${statusMap[enq.status] || 'badge-closed'}`}>
                        {enq.status || 'NEW'}
                      </span>
                    </td>
                    <td>
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
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