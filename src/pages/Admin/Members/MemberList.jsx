import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { memberAPI } from '../../../services/api';
import SmartImage from '../../../components/common/SmartImage';

/**
 * =========================================================
 * MEMBER LIST (ADMIN)
 * =========================================================
 *
 * Covers the proposal's "Manage Members":
 *   view member list, search members, edit member details,
 *   activate / deactivate accounts, delete members.
 */

const PAGE_SIZE = 20;

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Debounce the search box so typing does not fire a request
  // per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await memberAPI.getAll({
        page,
        limit: PAGE_SIZE,
        ...(search ? { search } : {}),
        ...(status !== 'all' ? { status } : {}),
      });

      setMembers(response.data || []);
      setPagination(response.pagination || { page: 1, totalPages: 0, total: 0 });
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err?.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleToggleStatus = async (member) => {
    const action = member.isActive ? 'deactivate' : 'activate';

    if (!window.confirm(`Are you sure you want to ${action} ${member.name}'s account?`)) {
      return;
    }

    // Optimistic update, rolled back if the request fails.
    const previous = members;

    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, isActive: !item.isActive } : item
      )
    );

    try {
      await memberAPI.setStatus(member.id, !member.isActive);
    } catch (err) {
      console.error('Error updating member status:', err);
      setMembers(previous);
      setError(err?.response?.data?.message || 'Failed to update account status');
    }
  };

  const handleDelete = async (member) => {
    if (
      !window.confirm(
        `Delete ${member.name} (${member.membershipNumber})? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await memberAPI.delete(member.id);
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err?.response?.data?.message || 'Failed to delete member');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1>Members</h1>
          <p>
            {pagination.total} member{pagination.total === 1 ? '' : 's'} registered
          </p>
        </div>

        <Link to="/admin/members/new" className="btn btn-primary">
          + Add New Member
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ============ FILTERS ============ */}
      <div className="filter-bar">
        <input
          type="search"
          className="form-control"
          placeholder="Search by name, email, phone or membership number…"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <select
          className="form-control"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          style={{ maxWidth: '200px' }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

      {/* ============ TABLE ============ */}
      <div className="table-card">
        {loading ? (
          <div className="flex-center" style={{ minHeight: '240px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Membership No.</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <span className="icon">🧑‍🤝‍🧑</span>
                        <p>
                          {search || status !== 'all'
                            ? 'No members match your filters'
                            : 'No members yet'}
                        </p>
                        {!search && status === 'all' && (
                          <Link
                            to="/admin/members/new"
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '12px' }}
                          >
                            Add your first member
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="cell-user">
                          <SmartImage
                            src={member.profileImage}
                            variant="avatar"
                            alt={member.name}
                            width={80}
                            height={80}
                            className="cell-avatar"
                          />
                          <div>
                            <div style={{ fontWeight: 500 }}>{member.name}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <code className="code-chip">{member.membershipNumber}</code>
                      </td>

                      <td>{member.phone || '—'}</td>

                      <td>
                        <span
                          className={`badge ${
                            member.isActive ? 'badge-converted' : 'badge-closed'
                          }`}
                        >
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td>{formatDate(member.joinedAt || member.createdAt)}</td>

                      <td style={{ textAlign: 'right' }}>
                        <div className="row-actions">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(member)}
                            className="btn btn-secondary btn-sm"
                          >
                            {member.isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          <Link
                            to={`/admin/members/edit/${member.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ PAGINATION ============ */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
