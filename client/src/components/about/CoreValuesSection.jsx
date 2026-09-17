// client/src/components/about/CoreValuesSection.jsx
import React from 'react';
import valCorp from '../../assets/value-corp.png';
import valIntegrity from '../../assets/value-integrity.png';
import valQuality from '../../assets/value-quality.png';
import valInnovation from '../../assets/value-innovation.png';
import valSustain from '../../assets/value-sustain.png';
import valCommunity from '../../assets/value-community.png';
import './CoreValuesSection.css';

const CoreValuesSection = () => {
  const values = [
    { tag: 'CORPORATION', desc: 'We believe shared effort creates stronger and more sustainable growth.', img: valCorp },
    { tag: 'INTEGRITY', desc: 'We operate with transparency, accountability and responsible business practices.', img: valIntegrity },
    { tag: 'QUALITY', desc: 'We focus on delivering products that meet practical business requirements.', img: valQuality },
    { tag: 'INNOVATION', desc: 'We combine cooperative values with modern ideas and industrial practices.', img: valInnovation },
    { tag: 'SUSTAINABILITY', desc: 'Sustainable choices for long-term value.', img: valSustain },
    { tag: 'COMMUNITY', desc: 'We believe business growth should contribute to the communities around us.', img: valCommunity },
  ];

  return (
    <section className="core-values-section">
      <span className="core-label">OUR CORE VALUES</span>
      <h2 className="core-title">Values that Guide Us</h2>

      <div className="values-grid">
        {values.map((v, idx) => (
          <div className="value-card" key={idx}>
            <img src={v.img} alt={v.tag} className="value-bg" />
            <div className="value-overlay" />
            <div className="value-content">
              <span className="value-tag">{v.tag}</span>
              <p className="value-desc">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreValuesSection;