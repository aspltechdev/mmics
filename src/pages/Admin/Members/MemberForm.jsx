import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { memberAPI } from '../../../services/api';
import SmartImage from '../../../components/common/SmartImage';

/**
 * =========================================================
 * MEMBER FORM (ADMIN)
 * =========================================================
 *
 * Covers the proposal's "Add Members" and the
 * "Member Information Fields" list:
 *
 *   Member Name, Contact Number, Email Address, Address,
 *   Membership Number, Profile Image, Account Status
 *
 * Leaving the membership number blank makes the server
 * generate the next one in sequence (MEM-2026-0001).
 * Leaving the password blank on create makes the server
 * generate a temporary one, which is shown once afterwards.
 */

const MEMBERSHIP_TYPES = ['Regular', 'Associate', 'Life', 'Honorary'];

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipNumber: '',
    membershipType: 'Regular',
    password: '',
    isActive: true,
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');

  /* -------------------------------------------------------
     LOAD EXISTING MEMBER
     ------------------------------------------------------- */

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const member = await memberAPI.getById(id);

        setForm({
          name: member.name || '',
          email: member.email || '',
          phone: member.phone || '',
          address: member.address || '',
          membershipNumber: member.membershipNumber || '',
          membershipType: member.membershipType || 'Regular',
          password: '',
          isActive: member.isActive === true,
        });

        setExistingImage(member.profileImage || null);
      } catch (err) {
        console.error('Error loading member:', err);
        setError(err?.response?.data?.message || 'Failed to load member');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit]);

  /* -------------------------------------------------------
     REVOKE PREVIEW URLS
     ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  /* -------------------------------------------------------
     HANDLERS
     ------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Profile image must be a JPG, PNG or WebP file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image must be smaller than 5MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setProfileImageFile(file);

    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setTemporaryPassword('');

    if (!form.name.trim()) {
      setError('Member name is required.');
      return;
    }

    if (!form.email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        membershipType: form.membershipType,
        isActive: form.isActive,
      };

      // Only send these when the admin actually filled them in.
      if (form.membershipNumber.trim()) {
        payload.membershipNumber = form.membershipNumber.trim();
      }

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (profileImageFile) {
        payload.profileImage = profileImageFile;
      }

      if (isEdit) {
        await memberAPI.update(id, payload);
        navigate('/admin/members');
        return;
      }

      const response = await memberAPI.create(payload);

      // The generated password is returned exactly once.
      if (response?.temporaryPassword) {
        setTemporaryPassword(response.temporaryPassword);
        return;
      }

      navigate('/admin/members');
    } catch (err) {
      console.error('Error saving member:', err);
      setError(err?.response?.data?.message || 'Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     RENDER
     ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="spinner" />
      </div>
    );
  }

  // Shown after creating a member whose password was
  // auto-generated.
  if (temporaryPassword) {
    return (
      <div className="dashboard-container">
        <div className="form-card" style={{ maxWidth: '560px' }}>
          <h2>Member account created</h2>

          <p style={{ color: '#475569', marginTop: '8px' }}>
            Share these details with the member. This password is shown once and cannot be
            retrieved later — you can always set a new one by editing the member.
          </p>

          <div className="credential-box">
            <div>
              <span className="credential-label">Email</span>
              <code>{form.email.trim()}</code>
            </div>
            <div>
              <span className="credential-label">Temporary password</span>
              <code>{temporaryPassword}</code>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigator.clipboard?.writeText(temporaryPassword)}
            >
              Copy password
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/admin/members')}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Member' : 'Add New Member'}</h1>
          <p>
            {isEdit
              ? 'Update this member’s details and account status'
              : 'Create a member profile and generate their portal account'}
          </p>
        </div>

        <Link to="/admin/members" className="btn btn-secondary">
          ← Back to members
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          {/* ---------- PROFILE IMAGE ---------- */}
          <div className="form-field form-field-full">
            <label>Profile Image</label>

            <div className="image-picker">
              <SmartImage
                src={profileImagePreview || existingImage}
                variant="avatar"
                alt="Member profile"
                width={160}
                height={160}
                className="image-picker-preview"
              />

              <div className="image-picker-controls">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  id="member-profile-image"
                  className="visually-hidden"
                />

                <label htmlFor="member-profile-image" className="btn btn-secondary btn-sm">
                  {existingImage || profileImagePreview ? 'Change photo' : 'Upload photo'}
                </label>

                {profileImagePreview && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={removeSelectedImage}
                  >
                    Remove
                  </button>
                )}

                <p className="field-hint">JPG, PNG or WebP. Maximum 5MB.</p>
              </div>
            </div>
          </div>

          {/* ---------- NAME ---------- */}
          <div className="form-field">
            <label htmlFor="name">
              Member Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>

          {/* ---------- EMAIL ---------- */}
          <div className="form-field">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="member@example.com"
              required
            />
            <p className="field-hint">Used as the login for the member portal.</p>
          </div>

          {/* ---------- PHONE ---------- */}
          <div className="form-field">
            <label htmlFor="phone">Contact Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* ---------- MEMBERSHIP NUMBER ---------- */}
          <div className="form-field">
            <label htmlFor="membershipNumber">Membership Number</label>
            <input
              id="membershipNumber"
              name="membershipNumber"
              type="text"
              className="form-control"
              value={form.membershipNumber}
              onChange={handleChange}
              placeholder={isEdit ? '' : 'Leave blank to generate automatically'}
            />
            {!isEdit && (
              <p className="field-hint">
                Leave blank and the next number in sequence will be assigned.
              </p>
            )}
          </div>

          {/* ---------- MEMBERSHIP TYPE ---------- */}
          <div className="form-field">
            <label htmlFor="membershipType">Membership Type</label>
            <select
              id="membershipType"
              name="membershipType"
              className="form-control"
              value={form.membershipType}
              onChange={handleChange}
            >
              {MEMBERSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* ---------- PASSWORD ---------- */}
          <div className="form-field">
            <label htmlFor="password">{isEdit ? 'Reset Password' : 'Password'}</label>
            <input
              id="password"
              name="password"
              type="text"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder={
                isEdit ? 'Leave blank to keep current password' : 'Leave blank to generate one'
              }
              autoComplete="new-password"
            />
            <p className="field-hint">Minimum 8 characters.</p>
          </div>

          {/* ---------- ADDRESS ---------- */}
          <div className="form-field form-field-full">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              className="form-control"
              rows="3"
              value={form.address}
              onChange={handleChange}
              placeholder="Postal address"
            />
          </div>

          {/* ---------- ACCOUNT STATUS ---------- */}
          <div className="form-field form-field-full">
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <span>
                <strong>Account Active</strong>
                <br />
                <span className="field-hint">
                  Inactive members cannot sign in to the member portal.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/members" className="btn btn-secondary">
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
