// client/src/components/about/AboutHero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import aboutHero from '../../assets/about-hero.png';
import './AboutHero.css';

const AboutHero = () => {
  return (
    <section
      className="about-hero"
      style={{ backgroundImage: `url(${aboutHero})` }}
    >
      <div className="about-hero-overlay" />

      <div className="about-hero-content">
        <span className="about-hero-label">WHO WE ARE</span>

        <h1 className="about-hero-title">
          Complete Range of
          <br />
          <span className="highlight">Packaging &amp; Industrial</span>
          <br />
          <span className="highlight">Solutions</span>
        </h1>

        <p className="about-hero-desc">
          Explore our range of packaging, eco-friendly and material-handling
          products designed to meet the diverse needs of businesses and
          industries.
        </p>

        <div className="about-hero-buttons">
          <Link to="/contact" className="btn-white">
            Request a Quote
          </Link>
          <Link to="/products" className="btn-outline-white">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;