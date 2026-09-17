// client/src/components/home/WhyMmmicsSection.jsx
import React from 'react';
import { ShieldCheck, Gem, Leaf, Factory, Users } from 'lucide-react';
import './WhyMmmicsSection.css';

const WhyMmmicsSection = () => {
  const features = [
    { icon: <ShieldCheck size={20} />, title: 'Quality', desc: 'Products selected with quality and performance in mind.' },
    { icon: <ShieldCheck size={20} />, title: 'Reliability', desc: 'Dependable solutions for regular and bulk requirements.' },
    { icon: <Gem size={20} />, title: 'Value', desc: 'Practical products that make business sense.' },
    { icon: <Leaf size={20} />, title: 'Sustainability', desc: 'Eco-friendly alternatives for more responsible choices.' },
    { icon: <Factory size={20} />, title: 'Industry Understanding', desc: 'A diverse portfolio designed around real business needs.' },
    { icon: <Users size={20} />, title: 'Customer Focus', desc: 'Responsive support from requirement to delivery.' },
  ];

  return (
    <section className="why-section">
      <div className="why-content">
        <span className="why-label">WHY MMMICS</span>
        <h2 className="why-title">
          More Than Products. <span className="highlight">A Partner for Your Business.</span>
        </h2>
        <div className="why-grid">
          {features.map((feature, idx) => (
            <div className="why-card" key={idx}>
              <div className="why-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMmmicsSection;