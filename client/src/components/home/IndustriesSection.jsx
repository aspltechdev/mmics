// client/src/components/home/IndustriesSection.jsx
import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './IndustriesSection.css';

const IndustriesSection = () => {
  const industries = [
    { id: 1, name: 'Food & Beverage', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Agriculture', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Retail & E-Commerce', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <section className="industries-section">
      <div className="industries-content">
        <span className="industries-label">INDUSTRIES WE SERVE</span>
        <h2 className="industries-title">
          Solutions Across <span className="highlight">Diverse Industries</span>
        </h2>
        <p className="industries-desc">
          Every industry has different requirements. Our product range helps businesses address their packaging, handling and operational needs.
        </p>
        <button className="btn-primary">See All Products <ArrowRight size={18} /></button>
      </div>
      <div className="industries-carousel">
        <button className="arrow-btn left"><ChevronLeft size={20} /></button>
        {industries.map((ind) => (
          <div className="industry-card" key={ind.id}>
            <img src={ind.img} alt={ind.name} />
            <div className="industry-overlay">
              <h3>{ind.name}</h3>
            </div>
          </div>
        ))}
        <button className="arrow-btn right"><ChevronRight size={20} /></button>
      </div>
    </section>
  );
};

export default IndustriesSection;