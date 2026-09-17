// client/src/components/about/MissionVisionSection.jsx

import React from 'react';
import missionImg from '../../assets/mission.png';
import visionImg from '../../assets/mission.png';
import './MissionVisionSection.css';

const MissionVisionSection = () => {
  return (
    <section className="mission-vision-section">
      {/* MISSION ROW — image left, blue blob right */}
      <div className="mv-row">
        <div className="mv-image">
          <img src={missionImg} alt="Mission" />
        </div>

        <div className="mv-content mv-mission">
          <span className="mv-label">MISSION</span>

          <h2 className="mv-title">
            Empowering <span className="highlight-orange">Growth</span> Through
            <br />
            <span className="highlight-orange">Packaging</span>
          </h2>

          <p className="mv-desc">
            Supporting members with raw materials, marketing, and financial
            assistance for sustainable growth.
          </p>

          <p className="mv-desc">
            Manufacturing high-quality, eco-friendly, cost-effective packaging
            while ensuring inclusive growth and fair member benefits.
          </p>
        </div>
      </div>

      {/* VISION ROW — peach blob left, image right */}
      <div className="mv-row reverse">
        <div className="mv-content mv-vision">
          <span className="mv-label">VISION</span>

          <h2 className="mv-title">
            Creating a sustainable
            <br />
            <span className="highlight-blue">Ecosystem</span>
          </h2>

          <p className="mv-desc">
            Building a cooperative ecosystem driven by innovation, inclusion,
            and ethical manufacturing.
          </p>

          <p className="mv-desc">
            Delivering world-class packaging solutions that empower
            entrepreneurs and enable sustainable industrial growth.
          </p>
        </div>

        <div className="mv-image">
          <img src={visionImg} alt="Vision" />
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;