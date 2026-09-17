// client/src/components/home/FaqSection.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FaqSection.css';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: 'What products does MMMICS offer?', a: 'MMMICS offers a diverse range of packaging, eco-friendly and industrial products, including corrugated boxes, PP woven sacks, paper cups, jute products, pallets, plastic crates and more.' },
    { q: 'Do you handle bulk orders?', a: 'Yes, we specialize in handling bulk and recurring orders for businesses and industries.' },
    { q: 'Can I request a quotation?', a: 'Absolutely. You can request a quote by clicking the Request a Quote button or contacting us directly.' },
    { q: 'Do you offer eco-friendly products?', a: 'Yes, sustainability is a core focus. We offer a range of eco-friendly packaging alternatives including biodegradable and recyclable options.' },
    { q: 'Can products be customized?', a: 'Yes, many of our products can be customized in terms of size, material, and branding.' },
    { q: 'Which industries do you serve?', a: 'We serve a wide range of industries including Food & Beverage, Agriculture, Retail & E-Commerce, Manufacturing, and Logistics.' },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      <span className="faq-label">FAQ</span>
      <h2 className="faq-title">Common Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div className={`faq-item ${openIndex === idx ? 'active' : ''}`} key={idx}>
            <div className="faq-question" onClick={() => toggleFaq(idx)}>
              {faq.q}
              <ChevronDown size={20} className="faq-icon" />
            </div>
            {openIndex === idx && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;