import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    fullDescription: '',
    material: '',
    moq: '',
    customization: '',
    isFeatured: false,
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productAPI.getBySlug(id);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        categoryId: product.categoryId || '',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        material: product.material || '',
        moq: product.moq || '',
        customization: product.customization || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
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
        await productAPI.update(id, formData);
      } else {
        await productAPI.create(formData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Failed to save product');
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
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            {isEdit ? 'Update product details' : 'Create a new product'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="btn btn-secondary">
          ← Back to Products
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
            <label className="form-label">Product Name *</label>
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

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Kraft Paper"
            />
          </div>

          <div className="form-group">
            <label className="form-label">MOQ</label>
            <input
              type="text"
              name="moq"
              value={formData.moq}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 500 pieces"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customization</label>
            <input
              type="text"
              name="customization"
              value={formData.customization}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Custom printing available"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="form-control"
            placeholder="Brief description"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Description</label>
          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            className="form-control"
            rows="6"
            placeholder="Detailed product description"
          />
        </div>

        <div className="grid-2">
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="form-label" style={{ margin: 0 }}>Featured</label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
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
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;