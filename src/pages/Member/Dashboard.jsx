import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberAuthAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SmartImage from '../../components/common/SmartImage';

/**
 * =========================================================
 * MEMBER DASHBOARD
 * =========================================================
 *
 * Built to the proposal's "Member Dashboard" section.
 * Members can view:
 *
 *   - Personal profile details
 *   - Membership information
 *   - Account details
 *
 * All of it arrives from one request:
 * GET /api/member/auth/dashboard
 */

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

const formatDateTime = (value) => {
  if (!value) return 'This is your first sign in';

  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** A labelled row inside one of the detail cards. */
const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || '—'}</span>
  </div>
);

const MemberDashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await memberAuthAPI.getDashboard();
        setData(result);
      } catch (err) {
        console.error('Member dashboard load failed:', err);
        setError(
          err?.response?.data?.message || 'Could not load your dashboard. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '320px' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const { profile, membership, account, organisation } = data || {};

  return (
    <div className="member-dashboard">
      {/* ============ WELCOME ============ */}
      <section className="member-welcome">
        <SmartImage
          src={profile?.profileImage}
          variant="avatar"
          alt={profile?.name || 'Member'}
          width={160}
          height={160}
          className="member-welcome-avatar"
        />

        <div className="member-welcome-text">
          <h1>
            {getGreeting()}, {profile?.name || user?.name || 'Member'}
          </h1>
          <p>
            You are signed in to the {organisation?.companyName || 'MMMICS Limited'} member
            portal.
          </p>
        </div>

        <span className={`status-pill ${membership?.status === 'Active' ? 'is-active' : 'is-inactive'}`}>
          {membership?.status || 'Unknown'}
        </span>
      </section>

      {/* ============ SUMMARY TILES ============ */}
      <section className="member-tiles">
        <div className="member-tile">
          <span className="tile-icon">🏷️</span>
          <div>
            <span className="tile-label">Membership Number</span>
            <span className="tile-value">{membership?.membershipNumber || '—'}</span>
          </div>
        </div>

        <div className="member-tile">
          <span className="tile-icon">⭐</span>
          <div>
            <span className="tile-label">Membership Type</span>
            <span className="tile-value">{membership?.membershipType || 'Regular'}</span>
          </div>
        </div>

        <div className="member-tile">
          <span className="tile-icon">📅</span>
          <div>
            <span className="tile-label">Member Since</span>
            <span className="tile-value">{formatDate(membership?.joinedAt)}</span>
          </div>
        </div>

        <div className="member-tile">
          <span className="tile-icon">📦</span>
          <div>
            <span className="tile-label">Products Available</span>
            <span className="tile-value">{organisation?.activeProducts ?? 0}</span>
          </div>
        </div>
      </section>

      {/* ============ DETAIL CARDS ============ */}
      <section className="member-cards">
        {/* Personal profile details */}
        <div className="member-card">
          <div className="member-card-head">
            <h2>Personal Profile</h2>
            <Link to="/member/profile" className="btn btn-secondary btn-sm">
              Edit
            </Link>
          </div>

          <DetailRow label="Full Name" value={profile?.name} />
          <DetailRow label="Email Address" value={profile?.email} />
          <DetailRow label="Contact Number" value={profile?.phone} />
          <DetailRow label="Address" value={profile?.address} />
        </div>

        {/* Membership information */}
        <div className="member-card">
          <div className="member-card-head">
            <h2>Membership Information</h2>
          </div>

          <DetailRow label="Membership Number" value={membership?.membershipNumber} />
          <DetailRow label="Membership Type" value={membership?.membershipType} />
          <DetailRow label="Joined On" value={formatDate(membership?.joinedAt)} />
          <DetailRow
            label="Status"
            value={
              <span
                className={`badge ${
                  membership?.status === 'Active' ? 'badge-converted' : 'badge-closed'
                }`}
              >
                {membership?.status}
              </span>
            }
          />
        </div>

        {/* Account details */}
        <div className="member-card">
          <div className="member-card-head">
            <h2>Account Details</h2>
          </div>

          <DetailRow
            label="Account Status"
            value={account?.isActive ? 'Active' : 'Inactive'}
          />
          <DetailRow label="Last Sign In" value={formatDateTime(account?.lastLoginAt)} />
          <DetailRow label="Account Created" value={formatDate(account?.createdAt)} />
          <DetailRow label="Last Updated" value={formatDate(account?.updatedAt)} />
        </div>

        {/* Organisation contact */}
        <div className="member-card">
          <div className="member-card-head">
            <h2>Need Help?</h2>
          </div>

          <p className="member-card-text">
            For any changes to your membership record, or if something here looks wrong, please
            get in touch with the office.
          </p>

          <DetailRow label="Phone" value={organisation?.phone} />
          <DetailRow label="Email" value={organisation?.email} />
          <DetailRow label="Address" value={organisation?.address} />
        </div>
      </section>
    </div>
  );
};

export default MemberDashboard;
