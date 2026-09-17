// client/src/components/about/ContactCtaSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ctaBg from '../../assets/about-cta-bg.png';
import './ContactCtaSection.css';

const ContactCtaSection = () => {
  return (
    <section className="about-cta" style={{ backgroundImage: `url(${ctaBg})` }}>
      <div className="about-cta-overlay" />
      <div className="about-cta-content">
        <span className="about-cta-label">YOUR NEXT STEP</span>
        <h2 className="about-cta-title">
          Let's Build Something <span className="highlight">Better Together.</span>
        </h2>
        <p className="about-cta-desc">
          Explore opportunities to work with MMMICS and move your business
          forward.
        </p>
        <Link to="/contact" className="btn-white">
          Contact Us <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default ContactCtaSection;