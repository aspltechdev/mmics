import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll({ limit: 100 }),
        categoryAPI.getAll()
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>Products</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>Manage your product catalogue</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <span className="empty-icon">📦</span>
                      <p>No products found</p>
                      <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '12px' }}>
                        Add your first product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map(product => {
                  const category = categories.find(c => c.id === product.categoryId);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: '#a0aec0' }}>{product.slug}</div>
                      </td>
                      <td>{category?.name || 'Uncategorized'}</td>
                      <td>
                        <span className={`badge ${product.isActive ? 'badge-new' : 'badge-closed'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{product.isFeatured ? '⭐ Featured' : '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link 
                          to={`/admin/products/edit/${product.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: '8px' }}
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;