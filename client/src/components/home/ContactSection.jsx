// client/src/components/home/ContactSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section className="contact-cta-section">
      <div className="contact-cta-content">
        <span className="contact-cta-label">LET'S CONNECT</span>
        <h2 className="contact-cta-title">
          Have a Packaging <span className="highlight">Requirement?</span>
        </h2>
        <p className="contact-cta-desc">
          Whether you need standard packing or a customized solution, our team is ready to help your business grow.
        </p>
        <button className="btn-primary">Contact Us <ArrowRight size={18} /></button>
      </div>
      <div className="contact-cta-image">
        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Contact MMMICS" />
      </div>
    </section>
  );
};

export default ContactSection;