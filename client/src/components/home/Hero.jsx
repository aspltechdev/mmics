// client/src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroSlideService from '../../services/heroSlideService';
import './Hero.css';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Build the base URL for images (strips /api from VITE_API_URL)
  const serverBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await heroSlideService.getAll();
        setSlides(data.slides || []);
      } catch (error) {
        console.error('Failed to load hero slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-advance slides every 6 seconds if more than 1 slide exists
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) return <div className="hero-section" style={{minHeight: '400px'}}>Loading...</div>;
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Static Badge - can be made dynamic later */}
        <div className="hero-badge">
          <CheckCircle size={14} /> SUSTAINABLE PACKAGING & INDUSTRIAL SOLUTIONS
        </div>

        <h1 className="hero-title">
          {slide.title}
        </h1>
        
        <p className="hero-subtitle">
          {slide.description}
        </p>

        <div className="hero-buttons">
          {slide.buttonText && (
            <a href={slide.buttonUrl || '#'} className="btn-primary">
              {slide.buttonText}
            </a>
          )}
          <button className="btn-secondary">Explore Products <ArrowRight size={18} /></button>
        </div>

        {/* Slide Navigation Dots */}
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hero-image">
        <img
          src={`${serverBaseUrl}${slide.imageUrl}`}
          alt={slide.title}
        />
      </div>
    </section>
  );
};

export default Hero;