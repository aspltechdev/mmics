import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI } from '../../../services/api';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await categoryAPI.getBySlug(id);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await categoryAPI.update(id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
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
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            {isEdit ? 'Update category details' : 'Create a new category'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/categories')} className="btn btn-secondary">
          ← Back to Categories
        </button>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '16px' }}>
          <span className="error-icon">✕</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="e.g. eco-friendly-bags"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Category description"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label className="form-label" style={{ margin: 0 }}>Active</label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
          </button>
          <button type="button" onClick={() => navigate('/admin/categories')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;