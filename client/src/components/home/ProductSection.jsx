// client/src/components/home/ProductSection.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import productService from '../../services/productService';
import './ProductSection.css';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Base URL for images
  const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Only fetch ACTIVE products for the public site
        const data = await productService.getAll({ status: 'ACTIVE' });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter logic
  const displayedProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.isBestSeller); // If you add a bestseller field later

  // Helper to find primary image
  const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    const primary = product.images.find(img => img.isPrimary);
    return `${serverBaseUrl}${(primary || product.images[0]).imageUrl}`;
  };

  return (
    <section className="products-section">
      <span className="products-label">OUR SOLUTIONS</span>
      <h2 className="products-title">
        Packaging <span className="highlight">Solutions for Every Requirement</span>
      </h2>
      <p className="products-subtitle">
        Explore our range of packaging, material-handling and eco-friendly solutions designed for different business and industrial applications.
      </p>

      <div className="products-tabs">
        <button
          className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => setActiveTab('All')}
        >All</button>
        <button
          className={`tab-btn ${activeTab === 'Best Seller' ? 'active' : ''}`}
          onClick={() => setActiveTab('Best Seller')}
        >Best Seller</button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>
      ) : (
        <div className="products-grid">
          {displayedProducts.slice(0, 3).map((product) => (
            <div className="product-card" key={product.id}>
              <img src={getPrimaryImage(product)} alt={product.name} />
              <div className="product-card-content">
                <h3>{product.name}</h3>
                <p>{product.description ? product.description.substring(0, 90) + '...' : 'No description available.'}</p>
                <a href={`/products/${product.slug}`} className="product-link">
                  Explore {product.name} <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
          {displayedProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              No products available at the moment.
            </div>
          )}
        </div>
      )}

      <div className="products-cta">
        <a href="/products" className="btn-primary">See All Products <ArrowRight size={18} /></a>
      </div>
    </section>
  );
};

export default ProductSection;