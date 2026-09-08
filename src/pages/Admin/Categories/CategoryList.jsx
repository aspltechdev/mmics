import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
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
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>Categories</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>Manage product categories</p>
        </div>
        <Link to="/admin/categories/new" className="btn btn-primary">
          + Add New Category
        </Link>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <span className="empty-icon">🏷️</span>
                      <p>No categories found</p>
                      <Link to="/admin/categories/new" className="btn btn-primary" style={{ marginTop: '12px' }}>
                        Add your first category
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{category.name}</div>
                    </td>
                    <td style={{ color: '#718096' }}>{category.slug}</td>
                    <td>{category._count?.products || 0}</td>
                    <td>
                      <span className={`badge ${category.isActive ? 'badge-new' : 'badge-closed'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link 
                        to={`/admin/categories/edit/${category.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '8px' }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)}
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

export default CategoryList;