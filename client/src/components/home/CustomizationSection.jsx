// client/src/components/home/CustomizationSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CustomizationSection.css';

const CustomizationSection = () => {
  const customizations = [
    { id: 1, tag: 'BRAND PRINTING', title: 'Make Your Brand Stand Out', desc: 'Add your logo, branding and artwork to selected packaging solutions.', img: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 2, tag: 'BRAND PRINTING', title: 'Make Your Brand Stand Out', desc: 'Add your logo, branding and artwork to selected packaging solutions.', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 3, tag: 'BULK REQUIREMENTS', title: 'Built for Business Needs', desc: 'Flexible supply options for recurring, bulk and business packaging requirements.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  ];

  return (
    <section className="custom-section">
      <span className="custom-label">CUSTOMIZATION</span>
      <h2 className="custom-title">
        Solutions Tailored to <span className="highlight">Your Requirements</span>
      </h2>
      <p className="custom-subtitle">
        From size and material to branding and packaging specifications, explore flexible options designed around your business needs.
      </p>
      <div className="custom-grid">
        {customizations.map((item) => (
          <div className="custom-card" key={item.id}>
            <img src={item.img} alt={item.title} />
            <div className="custom-card-content">
              <span className="custom-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/contact" className="btn-primary">
        Request a Quote <ArrowRight size={18} />
      </Link>
    </section>
  );
};

export default CustomizationSection;