import React, { useState, useEffect } from 'react';
import { heroAPI } from '../../../services/api';
import SmartImage from '../../../components/common/SmartImage';

const HeroManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    ctaText2: '',
    ctaLink2: '',
    isActive: true,
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const data = await heroAPI.get();
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
        ctaText2: data.ctaText2 || '',
        ctaLink2: data.ctaLink2 || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
      if (data.backgroundImage) {
        setImagePreview(data.backgroundImage);
      }
    } catch (error) {
      console.error('Error fetching hero:', error);
      setError('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = {
        ...formData,
        backgroundImage: backgroundImage || undefined,
      };
      await heroAPI.update(data);
      setSuccess('Hero section updated successfully!');
      // Reset image state
      setBackgroundImage(null);
    } catch (error) {
      console.error('Error updating hero:', error);
      setError(error.response?.data?.message || 'Failed to update hero');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
            Hero Section
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Manage the homepage hero banner content
          </p>
        </div>
        <div className="flex-center" style={{ gap: '12px' }}>
          <span className={`badge ${formData.isActive ? 'badge-new' : 'badge-closed'}`}>
            {formData.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px' }}>
          <span className="error-icon">✕</span>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
        }}>
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
        {/* Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          padding: '40px 32px',
          marginBottom: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {imagePreview && (
            <SmartImage
              src={imagePreview}
              alt="Background"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              {formData.title || 'Hero Title'}
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>
              {formData.subtitle || 'Hero Subtitle'}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'white',
                color: '#667eea',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: '600',
              }}>
                {formData.ctaText || 'Button 1'}
              </span>
              <span style={{
                background: 'transparent',
                border: '2px solid white',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: '600',
              }}>
                {formData.ctaText2 || 'Button 2'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Hero Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Main hero heading"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="form-control"
              placeholder="Subtitle under heading"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Button 1 Text *</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="e.g. Explore Products"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button 1 Link *</label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="e.g. /products"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Button 2 Text</label>
            <input
              type="text"
              name="ctaText2"
              value={formData.ctaText2}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Request a Quote"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button 2 Link</label>
            <input
              type="text"
              name="ctaLink2"
              value={formData.ctaLink2}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. /quote"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
            style={{ padding: '8px' }}
          />
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Recommended size: 1920 x 1080px (JPEG or PNG)
          </p>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label className="form-label" style={{ margin: 0 }}>Active</label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>
            Uncheck to hide hero section on homepage
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Hero Section'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroManager;