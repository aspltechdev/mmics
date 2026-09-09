import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { enquiryAPI } from '../../../services/api';

const EnquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const fetchEnquiry = async () => {
    try {
      setLoading(true);
      const data = await enquiryAPI.getById(id);
      setEnquiry(data);
      setNotes(data.internalNotes || '');
    } catch (error) {
      console.error('Error fetching enquiry:', error);
      navigate('/admin/enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true);
      await enquiryAPI.update(id, { status });
      setEnquiry({ ...enquiry, status });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setUpdating(true);
      await enquiryAPI.update(id, { internalNotes: notes });
      setEnquiry({ ...enquiry, internalNotes: notes });
      alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="dashboard-container">
        <h2>Enquiry not found</h2>
        <button onClick={() => navigate('/admin/enquiries')} className="btn btn-primary">
          Back to Enquiries
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
            Enquiry Details
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            View and manage customer enquiry
          </p>
        </div>
        <button onClick={() => navigate('/admin/enquiries')} className="btn btn-secondary">
          ← Back to Enquiries
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column - Enquiry Info */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Customer Name
              </label>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{enquiry.name}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Company
              </label>
              <p style={{ fontSize: '16px' }}>{enquiry.company || 'Not provided'}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Email
              </label>
              <p style={{ fontSize: '16px' }}><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Phone
              </label>
              <p style={{ fontSize: '16px' }}><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Product
              </label>
              <p style={{ fontSize: '16px' }}>{enquiry.product?.name || 'Not specified'}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Quantity
              </label>
              <p style={{ fontSize: '16px' }}>{enquiry.quantity || 'Not specified'}</p>
            </div>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              Requirements
            </label>
            <p style={{ fontSize: '15px', marginTop: '4px' }}>{enquiry.requirements || 'No specific requirements'}</p>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              Message
            </label>
            <p style={{ fontSize: '15px', marginTop: '4px' }}>{enquiry.message || 'No message'}</p>
          </div>

          <div style={{ marginTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
            Received: {new Date(enquiry.createdAt).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Right Column - Status & Notes */}
        <div>
          {/* Status */}
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Status</h3>
            <select
              value={enquiry.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className={`badge ${statusColors[enquiry.status] || 'badge-closed'}`}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="NEW">🟦 New</option>
              <option value="CONTACTED">🟨 Contacted</option>
              <option value="IN_PROGRESS">🟪 In Progress</option>
              <option value="QUOTED">🟩 Quoted</option>
              <option value="CONVERTED">🟦 Converted</option>
              <option value="CLOSED">⬜ Closed</option>
            </select>
          </div>

          {/* Internal Notes */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handleSaveNotes}
              disabled={updating}
              className="btn btn-primary"
              style={{ marginTop: '12px', width: '100%' }}
            >
              {updating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetail;