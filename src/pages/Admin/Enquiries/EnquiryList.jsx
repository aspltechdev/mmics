import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enquiryAPI } from '../../../services/api';

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await enquiryAPI.getAll({ limit: 100 });
      setEnquiries(response.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await enquiryAPI.update(id, { status });
      setEnquiries(prev =>
        prev.map(e => e.id === id ? { ...e, status } : e)
      );
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Failed to update enquiry status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiryAPI.delete(id);
      setEnquiries(enquiries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const statusColors = {
    NEW: 'badge-new',
    CONTACTED: 'badge-contacted',
    IN_PROGRESS: 'badge-in-progress',
    QUOTED: 'badge-quoted',
    CONVERTED: 'badge-converted',
    CLOSED: 'badge-closed',
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.name.toLowerCase().includes(search.toLowerCase()) ||
                          enquiry.email.toLowerCase().includes(search.toLowerCase()) ||
                          enquiry.product?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || enquiry.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>Enquiries</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Manage customer enquiries and quote requests
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-new">Total: {enquiries.length}</span>
          <span className="badge badge-new">New: {enquiries.filter(e => e.status === 'NEW').length}</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            flex: '1',
            minWidth: '200px',
            fontSize: '14px'
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          <option value="ALL">All Status</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="QUOTED">Quoted</option>
          <option value="CONVERTED">Converted</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button
          onClick={() => { setSearch(''); setFilter('ALL'); }}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Enquiries Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <span className="empty-icon">✉️</span>
                      <p>No enquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{enquiry.name}</div>
                      {enquiry.company && (
                        <div style={{ fontSize: '12px', color: '#718096' }}>{enquiry.company}</div>
                      )}
                    </td>
                    <td>{enquiry.product?.name || 'Not specified'}</td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{enquiry.email}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{enquiry.phone}</div>
                    </td>
                    <td>
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                        className={`badge ${statusColors[enquiry.status] || 'badge-closed'}`}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="QUOTED">Quoted</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td>
                      {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/admin/enquiries/${enquiry.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '8px' }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
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

export default EnquiryList;