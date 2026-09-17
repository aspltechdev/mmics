// client/src/components/home/GallerySection.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import galleryService from '../../services/galleryService';
import './GallerySection.css';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL for images
  const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryService.getAll(); // Fetches only active galleries
        
        // Flatten all images from all active galleries into one array
        const allImages = data.galleries?.flatMap(g => 
          g.images.map(img => ({
            ...img,
            galleryTitle: g.title
          }))
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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading gallery...</div>;
  if (images.length === 0) return null; // Don't show section if no images

  // Determine grid layout: first image large, rest normal
  const displayedImages = images.slice(0, 5);

  return (
    <section className="gallery-section">
      <span className="gallery-label">INSIDE MMMICS</span>
      <h2 className="gallery-title">
        See <span className="highlight">Our Work in Action</span>
      </h2>
      
      <div className="gallery-grid">
        {displayedImages.map((img, idx) => (
          <div 
            className={`gallery-item ${idx === 0 ? 'large' : ''}`} 
            key={img.id}
          >
            <img 
              src={`${serverBaseUrl}${img.imageUrl}`} 
              alt={img.caption || img.galleryTitle || 'Gallery'} 
            />
          </div>
        ))}
      </div>
      
      <div className="gallery-cta">
        <a href="/gallery" className="btn-primary">
          View Full Gallery <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default GallerySection;