// client/src/components/home/AboutSection.jsx
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-image">
        {/* Replace with your actual about image */}
        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About MMMICS" />
      </div>
      <div className="about-content">
        <span className="about-label">WHO WE ARE</span>
        <h2 className="about-title">
          Building Better Solutions for a <span className="highlight">Growing Business Ecosystem</span>
        </h2>
        <p className="about-desc">
          MMMICS Limited provides reliable packaging and industrial solutions designed to support businesses across diverse industries. We focus on quality, practical solutions and sustainable growth.
        </p>
        <div className="about-features">
          <div className="feature-item"><CheckCircle size={18} /> Quality-focused solutions</div>
          <div className="feature-item"><CheckCircle size={18} /> Reliable supply</div>
          <div className="feature-item"><CheckCircle size={18} /> Industry-ready products</div>
          <div className="feature-item"><CheckCircle size={18} /> Customer-focused approach</div>
          <div className="feature-item"><CheckCircle size={18} /> Sustainable choices</div>
          <div className="feature-item"><CheckCircle size={18} /> Cooperative values</div>
        </div>
        <button className="btn-primary">Know More <ArrowRight size={18} /></button>
      </div>
    </section>
  );
};

export default AboutSection;