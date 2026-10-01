// client/src/components/home/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './AboutSection.css';

import aboutImg1 from '../../assets/aboutmmics1.png';
import aboutImg2 from '../../assets/aboutmmics2.png';

const AboutSection = () => {
  const features = [
    'Quality-focused solutions',
    'Reliable supply',
    'Industry-ready products',
    'Customer-focused approach',
    'Sustainable choices',
    'Cooperative values',
  ];

  return (
    <section className="about-section">
      <div className="about-images">
        <div className="about-badge">MSCS ACT, 2002</div>
        <img src={aboutImg1} alt="MMMICS Team" className="about-img-main" />
        <img src={aboutImg2} alt="MMMICS Manufacturing" className="about-img-overlay" />
        <div className="about-stat-card">
          <div className="about-stat-number">12+</div>
          <div className="about-stat-label">Products &<br />Solutions</div>
        </div>
      </div>

      <div className="about-content">
        <span className="about-label">ABOUT MMMICS</span>

        <h2 className="about-title">
          Building Better Solutions for a
          <br />
          <span className="highlight">Growing Business Ecosystem</span>
        </h2>

        <p className="about-desc">
          MMMICS Limited is a manufacturing and industrial cooperative providing practical packaging and 
          industrial solutions for various departments across diverse sectors. Built on the principles of 
          cooperation, shared responsibility and collective growth, we focus on quality, reliability and 
          sustainable development while helping different departments meet their packaging, storage and material-handling needs.
        </p>

        <p className="about-desc">
          Our cooperative solutions span packaging products, eco-friendly alternatives and material-handling solutions, 
          supporting various departments with practical, reliable and sustainable products designed to meet their everyday operational requirements.
        </p>

        <div className="about-features">
          {features.map((feature, idx) => (
            <div className="feature-item" key={idx}>
              <CheckCircle size={18} />
              {feature}
            </div>
          ))}
        </div>

        <Link to="/about" className="btn-primary">
          Know More <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;