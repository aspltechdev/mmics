// client/src/components/home/TestimonialsSection.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    { id: 1, name: 'Customer Name', company: 'Company', text: 'Knowledge becomes wisdom through experience. Small changes can lead to remarkable results. Every challenge presents an opportunity for growth.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', active: false },
    { id: 2, name: 'Customer Name', company: 'Company', text: 'Every challenge presents an opportunity for growth. The best solutions often come from collaboration. Small changes lead to remarkable results.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', active: true },
    { id: 3, name: 'Customer Name', company: 'Company', text: 'The best solutions often come from collaboration. Knowledge becomes wisdom through experience. Small changes can lead to remarkable results.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', active: false },
  ];

  return (
    <section className="testimonials-section">
      <span className="testimonials-label">CUSTOMER EXPERIENCES</span>
      <h2 className="testimonials-title">
        Trusted by <span className="highlight">Businesses</span>
      </h2>
      <div className="testimonials-carousel">
        <button className="testimonial-arrow"><ChevronLeft size={20} /></button>
        {testimonials.map((t) => (
          <div className={`testimonial-card ${t.active ? 'active' : ''}`} key={t.id}>
            <div className="testimonial-header">
              <img src={t.img} alt={t.name} />
              <div className="customer-info">
                <h4 className="customer-name">{t.name}</h4>
                <p className="customer-company">{t.company}</p>
              </div>
            </div>
            <p className="testimonial-text">"{t.text}"</p>
          </div>
        ))}
        <button className="testimonial-arrow"><ChevronRight size={20} /></button>
      </div>
    </section>
  );
};

export default TestimonialsSection;