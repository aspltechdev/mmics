import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import SmartImage from '../../components/common/SmartImage';

/**
 * =========================================================
 * ADMIN DASHBOARD
 * =========================================================
 *
 * Loads from a single endpoint: GET /api/dashboard/stats
 *
 * Previously this screen fired six requests in parallel
 * (products, enquiries, contacts, directors, gallery, news),
 * each pulling up to 100 full records with their joined
 * categories and image arrays, only to read `.length` off the
 * result. That was slow, and the counts were capped at 100 so
 * they were also wrong once the site had real data.
 *
 * Now it is one request returning database COUNTs.
 */

const STATUS_CLASS = {
  NEW: 'badge-new',
  CONTACTED: 'badge-contacted',
  IN_PROGRESS: 'badge-in-progress',
  QUOTED: 'badge-quoted',
  CONVERTED: 'badge-converted',
  CLOSED: 'badge-closed',
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      }

      setError('');

      const result = await dashboardAPI.getStats({ refresh });
      setData(result);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setError(
        err?.response?.data?.message ||
          'Could not load dashboard data. Check that the API server is running.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="spinner" />
      </div>
    );
  }

  const stats = data?.stats || {};

  const cards = [
    {
      label: 'Products',
      value: stats.products ?? 0,
      color: 'blue',
      icon: '📦',
      sub: `${stats.activeProducts ?? 0} active`,
      to: '/admin/products',
    },
    {
      label: 'Members',
      value: stats.members ?? 0,
      color: 'indigo',
      icon: '🧑‍🤝‍🧑',
      sub: `${stats.activeMembers ?? 0} active`,
      to: '/admin/members',
    },
    {
      label: 'Enquiries',
      value: stats.enquiries ?? 0,
      color: 'green',
      icon: '✉️',
      sub: `${stats.newEnquiries ?? 0} new`,
      to: '/admin/enquiries',
    },
    {
      label: 'Contact Messages',
      value: stats.contacts ?? 0,
      color: 'yellow',
      icon: '💬',
      sub: `${stats.unreadContacts ?? 0} unread`,
      to: '/admin/contact',
    },
    {
      label: 'Gallery Images',
      value: stats.gallery ?? 0,
      color: 'pink',
      icon: '🖼️',
      sub: 'In gallery',
      to: '/admin/gallery',
    },
    {
      label: 'Directors',
      value: stats.directors ?? 0,
      color: 'purple',
      icon: '👤',
      sub: 'Board members',
      to: '/admin/directors',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dash-header dash-header-row">
        <div>
          <h1>{getGreeting()}! 👋</h1>
          <p>Here's what's happening with your website</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => load({ refresh: true })}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className={`stat-card stat-${card.color}`}>
            <div className="top">
              <div className="icon">{card.icon}</div>
            </div>
            <div className="value">{card.value}</div>
            <div className="label">{card.label}</div>
            <div className="sub">{card.sub}</div>
          </Link>
        ))}
      </div>

      <div className="dash-columns">
        {/* ============ RECENT ENQUIRIES ============ */}
        <div className="table-card">
          <div className="head">
            <div>
              <h3>Recent Enquiries</h3>
              <span className="sub">Latest quote requests from customers</span>
            </div>
            <Link to="/admin/enquiries" className="link">
              View all →
            </Link>
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
                {(data?.recentEnquiries || []).length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <span className="icon">📭</span>
                        <p>No enquiries yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{enquiry.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{enquiry.email}</div>
                      </td>
                      <td>{enquiry.product?.name || 'Not specified'}</td>
                      <td>
                        <span className={`badge ${STATUS_CLASS[enquiry.status] || 'badge-closed'}`}>
                          {enquiry.status || 'NEW'}
                        </span>
                      </td>
                      <td>{formatDate(enquiry.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============ RECENT MEMBERS ============ */}
        <div className="table-card">
          <div className="head">
            <div>
              <h3>Recent Members</h3>
              <span className="sub">Newest registered members</span>
            </div>
            <Link to="/admin/members" className="link">
              View all →
            </Link>
          </div>

          <div className="member-mini-list">
            {(data?.recentMembers || []).length === 0 ? (
              <div className="empty-state">
                <span className="icon">🧑‍🤝‍🧑</span>
                <p>No members yet</p>
                <Link to="/admin/members/new" className="btn btn-primary btn-sm">
                  Add the first member
                </Link>
              </div>
            ) : (
              data.recentMembers.map((member) => (
                <Link
                  key={member.id}
                  to={`/admin/members/edit/${member.id}`}
                  className="member-mini-row"
                >
                  <SmartImage
                    src={member.profileImage}
                    variant="avatar"
                    alt={member.name}
                    width={80}
                    height={80}
                    className="member-mini-avatar"
                  />

                  <div className="member-mini-info">
                    <div className="name">{member.name}</div>
                    <div className="meta">{member.membershipNumber}</div>
                  </div>

                  <span className={`badge ${member.isActive ? 'badge-converted' : 'badge-closed'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
