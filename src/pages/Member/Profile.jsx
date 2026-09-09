import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberAuthAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SmartImage from '../../components/common/SmartImage';

/**
 * =========================================================
 * MEMBER PROFILE
 * =========================================================
 *
 * A member may edit their own contact details, photo and
 * password.
 *
 * Membership number, membership type and account status are
 * shown read-only: those are administered by the office, and
 * the API rejects attempts to change them from here.
 */
const MemberProfile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  /* ------------------------------------------------------- */

  useEffect(() => {
    const load = async () => {
      try {
        const data = await memberAuthAPI.getMe();

        setProfile(data);
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (err) {
        console.error('Profile load failed:', err);
        setError(err?.response?.data?.message || 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* ------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setSuccess('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Your photo must be a JPG, PNG or WebP file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your photo must be smaller than 5MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setSuccess('');
    setImageFile(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Your name cannot be empty.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      if (imageFile) {
        payload.profileImage = imageFile;
      }

      const updated = await memberAuthAPI.updateProfile(payload);

      setProfile(updated);

      // Keep the header avatar and name in step with the edit.
      updateUser({
        name: updated.name,
        profileImage: updated.profileImage,
      });

      setImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      setSuccess('Your profile has been updated.');
    } catch (err) {
      console.error('Profile save failed:', err);
      setError(err?.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------- */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({ ...previous, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Your new password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('The two new passwords do not match.');
      return;
    }

    try {
      setPasswordSaving(true);

      await memberAuthAPI.changePassword(currentPassword, newPassword);

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Your password has been changed.');
    } catch (err) {
      console.error('Password change failed:', err);
      setPasswordError(err?.response?.data?.message || 'Could not change your password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  /* ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '320px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="member-dashboard">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Keep your contact details up to date</p>
        </div>

        <Link to="/member/dashboard" className="btn btn-secondary">
          ← Back to dashboard
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="member-cards member-cards-2">
        {/* ============ EDITABLE DETAILS ============ */}
        <form onSubmit={handleSubmit} className="member-card">
          <div className="member-card-head">
            <h2>Personal Details</h2>
          </div>

          <div className="image-picker">
            <SmartImage
              src={imagePreview || profile?.profileImage}
              variant="avatar"
              alt={profile?.name || 'Member'}
              width={160}
              height={160}
              className="image-picker-preview"
            />

            <div className="image-picker-controls">
              <input
                type="file"
                id="member-photo"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="visually-hidden"
              />

              <label htmlFor="member-photo" className="btn btn-secondary btn-sm">
                {profile?.profileImage || imagePreview ? 'Change photo' : 'Upload photo'}
              </label>

              <p className="field-hint">JPG, PNG or WebP. Maximum 5MB.</p>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              className="form-control"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* ============ READ ONLY + PASSWORD ============ */}
        <div className="member-card-stack">
          <div className="member-card">
            <div className="member-card-head">
              <h2>Membership Record</h2>
            </div>

            <p className="member-card-text">
              These details are maintained by the MMMICS office. Contact them if anything needs
              correcting.
            </p>

            <div className="detail-row">
              <span className="detail-label">Membership Number</span>
              <span className="detail-value">
                <code className="code-chip">{profile?.membershipNumber}</code>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Membership Type</span>
              <span className="detail-value">{profile?.membershipType || 'Regular'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{profile?.email || user?.email}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Account Status</span>
              <span className="detail-value">
                <span
                  className={`badge ${profile?.isActive ? 'badge-converted' : 'badge-closed'}`}
                >
                  {profile?.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="member-card">
            <div className="member-card-head">
              <h2>Change Password</h2>
            </div>

            {passwordError && <div className="alert alert-error">{passwordError}</div>}
            {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

            <div className="form-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="form-control"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </div>

            <div className="form-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="form-control"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
              <p className="field-hint">At least 8 characters.</p>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={passwordSaving}>
                {passwordSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
