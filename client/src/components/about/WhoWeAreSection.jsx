// client/src/components/about/WhoWeAreSection.jsx
import React from 'react';
import aboutBag from '../../assets/about-bag.png';
import './WhoWeAreSection.css';

const WhoWeAreSection = () => {
  return (
    <section className="who-we-are">
      <div className="who-content">
        <span className="who-label">WHO WE ARE</span>

        <h2 className="who-title">
          Innovating <span className="highlight">Together.</span>
          <br />
          Empowering Industries.
        </h2>

        <p className="who-desc">
          MMMICS Limited is a manufacturing and industrial cooperative providing
          practical packaging and industrial solutions for businesses across
          diverse sectors. We bring together quality products, reliable supply
          and cooperative values to support everyday business needs.
        </p>

        <p className="who-desc">
          From packaging and material handling to eco-friendly alternatives, our
          solutions are designed to provide practical value, dependable
          performance and flexibility for different business requirements.
        </p>

        <p className="who-desc">
          We believe sustainable growth comes through cooperation, responsible
          practices and strong relationships, creating value for our customers,
          members and communities.
        </p>
      </div>

      <div className="who-image-wrapper">
        <div className="who-badge">MSCS ACT, 2002</div>
        <img src={aboutBag} alt="MMMICS Handcrafted Bag" className="who-img" />
        <div className="who-stat-card">
          <div className="who-stat-number">12+</div>
          <div className="who-stat-label">
            Products &<br />Solutions
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;