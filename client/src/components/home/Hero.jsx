// client/src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroSlideService from '../../services/heroSlideService';
import './Hero.css';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    title: 'Packaging Solutions Built for Growing Industries',
    subtitle: 'SUSTAINABLE PACKAGING & INDUSTRIAL SOLUTIONS',
    description:
      'Reliable, practical and sustainable packaging solutions designed to meet the evolving needs of businesses, industries and organizations.',
    imageUrl:
      'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Request a Quote',
    buttonUrl: '/contact',
    isDefault: true,
  },
  {
    id: 'default-2',
    title: 'Industrial Packaging Built to Last',
    subtitle: 'STRENGTH · DURABILITY · RELIABILITY',
    description:
      'Heavy-duty corrugated boxes, wooden pallets and industrial-grade solutions designed for safe transport and long-term storage.',
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Explore Products',
    buttonUrl: '/products',
    isDefault: true,
  },
  {
    id: 'default-3',
    title: 'Eco-Friendly Packaging for a Better Tomorrow',
    subtitle: 'SUSTAINABLE · RECYCLABLE · RESPONSIBLE',
    description:
      'Biodegradable and recyclable packaging alternatives that help your business reduce its environmental footprint without compromising quality.',
    imageUrl:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Learn More',
    buttonUrl: '/about',
    isDefault: true,
  },
];

const Hero = () => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES); // start with defaults so UI never breaks
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const serverBaseUrl =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await heroSlideService.getAll();
        const fetched = Array.isArray(data?.slides) ? data.slides : [];

        // Use API slides only if there are 2 or more; otherwise keep defaults
        if (fetched.length >= 2) {
          setSlides(fetched);
        }
      } catch (error) {
        console.error('Failed to load hero slides, using defaults:', error);
      }
    };
    fetchSlides();
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) {
    return <div className="hero-section" style={{ minHeight: '560px' }} />;
  }

  const slide = slides[currentSlide];
  if (!slide) return null;

  const imageSrc = slide.isDefault
    ? slide.imageUrl
    : `${serverBaseUrl}${slide.imageUrl}`;

  const renderTitle = (title) => {
    if (!title) return null;
    const parts = title.split('Solutions');
    if (parts.length < 2) return title;
    return (
      <>
        {parts[0]}Solutions <span className="highlight">{parts[1].trim()}</span>
      </>
    );
  };

  return (
    <section className="hero-section">
      <div className="hero-content" key={slide.id}>
        <div className="hero-badge">
          <CheckCircle size={14} />{' '}
          {slide.subtitle || 'SUSTAINABLE PACKAGING & INDUSTRIAL SOLUTIONS'}
        </div>

        <h1 className="hero-title">{renderTitle(slide.title)}</h1>

        <p className="hero-subtitle">{slide.description}</p>

        <div className="hero-buttons">
          <Link to={slide.buttonUrl || '/contact'} className="btn-primary">
            {slide.buttonText || 'Request a Quote'}
          </Link>
          <Link to="/products" className="btn-secondary">
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="hero-image" key={`img-${slide.id}`}>
        <img src={imageSrc} alt={slide.title} />
      </div>

      {/* DOTS — always show since we always have >= 3 slides */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;