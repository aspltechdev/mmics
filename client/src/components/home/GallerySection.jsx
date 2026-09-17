// client/src/components/home/GallerySection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import galleryService from '../../services/galleryService';
import './GallerySection.css';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverBaseUrl =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryService.getAll();
        const allImages =
          data.galleries?.flatMap((g) =>
            g.images.map((img) => ({ ...img, galleryTitle: g.title }))
          ) || [];
        setImages(allImages);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <div className="gallery-section" style={{ padding: '40px', textAlign: 'center' }}>Loading gallery...</div>;
  }
  if (images.length === 0) return null;

  const displayedImages = images.slice(0, 5);

  return (
    <section className="gallery-section">
      <span className="gallery-label">INSIDE MMMICS</span>
      <h2 className="gallery-title">
        See <span className="highlight">Our Work in Action</span>
      </h2>
      <div className="gallery-grid">
        {displayedImages.map((img, idx) => (
          <div className={`gallery-item ${idx === 0 ? 'large' : ''}`} key={img.id}>
            <img
              src={`${serverBaseUrl}${img.imageUrl}`}
              alt={img.caption || img.galleryTitle || 'Gallery'}
            />
          </div>
        ))}
      </div>
      <div className="gallery-cta">
        <Link to="/gallery" className="btn-primary">
          View Full Gallery <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default GallerySection;