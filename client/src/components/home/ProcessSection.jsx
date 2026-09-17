// client/src/components/home/ProcessSection.jsx
import React from 'react';
import { FileEdit, Lightbulb, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import './ProcessSection.css';

const ProcessSection = () => {
  const steps = [
    { icon: <FileEdit size={24} />, step: 'Step 1', title: 'Share Your Requirement', desc: 'Tell us what product you need, along with your quantity, specifications and application.' },
    { icon: <Lightbulb size={24} />, step: 'Step 2', title: 'Get the Right Solution', desc: 'Our team reviews your requirement and recommends a suitable product or packaging solution.', highlight: true },
    { icon: <CheckCircle size={24} />, step: 'Step 3', title: 'Confirm Your Order', desc: 'Finalize the product specifications, quantity and delivery requirements with our team.' },
    { icon: <Truck size={24} />, step: 'Step 4', title: 'Supply & Delivery', desc: 'We coordinate your order and ensure the required products reach you as planned.' },
  ];

  return (
    <section className="process-section">
      <span className="process-label">SIMPLE & RELIABLE PROCESS</span>
      <h2 className="process-title">
        From Requirement to <span className="highlight">Delivery, Made Simple</span>
      </h2>
      <div className="process-grid">
        {steps.map((step, idx) => (
          <div className={`process-card ${step.highlight ? 'highlight-card' : ''}`} key={idx}>
            <div className="process-icon">{step.icon}</div>
            <div className="step-badge">{step.step}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
      <button className="btn-primary">Request a Quote <ArrowRight size={18} /></button>
    </section>
  );
};

export default ProcessSection;