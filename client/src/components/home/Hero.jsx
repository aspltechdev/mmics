// client/src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroSlideService from '../../services/heroSlideService';
import defaultHeroImage from '../../assets/hero-bags.png';
import './Hero.css';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    title: 'Packaging Solutions Built for Growing Industries',
    subtitle: 'SUSTAINABLE PACKAGING & INDUSTRIAL SOLUTIONS',
    description:
      'Reliable, practical and sustainable packaging solutions designed to meet the evolving needs of businesses, industries and organizations.',
    imageUrl: defaultHeroImage,
    buttonText: 'Request a Quote',
    buttonUrl: '/contact',
    isDefault: true,
  },
];

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const serverBaseUrl =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await heroSlideService.getAll();
        const fetched = data.slides || [];
        setSlides(fetched.length > 0 ? fetched : DEFAULT_SLIDES);
      } catch (error) {
        console.error('Failed to load hero slides:', error);
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
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
      <div className="hero-content">
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

      <div className="hero-image">
        <img src={imageSrc} alt={slide.title} />
      </div>

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
    </section>
  );
};

export default Hero;