// client/src/components/about/OurStorySection.jsx
import React from 'react';
import story1 from '../../assets/story-1.png';
import story2 from '../../assets/story-2.png';
import story3 from '../../assets/story-3.png';
import './OurStorySection.css';

const OurStorySection = () => {
  const cards = [
    {
      number: '01',
      title: 'A Cooperative Vision',
      desc: 'Built around the belief that collaboration creates stronger opportunities.',
      img: story1,
      variant: 'blue',
    },
    {
      number: '02',
      title: 'Solutions That Matter',
      desc: 'Developing practical packaging and industrial solutions for diverse business needs.',
      img: story2,
      variant: 'orange',
    },
    {
      number: '03',
      title: 'Growing Together',
      desc: 'Building lasting relationships with customers, members and business communities.',
      img: story3,
      variant: 'blue',
    },
  ];

  return (
    <section className="our-story-section">
      <span className="story-label">OUR STORY</span>
      <h2 className="story-title">
        where our <span className="highlight">Journey</span> Began
      </h2>
      <p className="story-subtitle">
        MMMICS Limited brings cooperation, practical solutions and business
        opportunities together. We provide reliable packaging and
        material-handling solutions while creating value for our members,
        customers and communities. Our journey is driven by quality,
        collaboration and responsible growth.
      </p>

      <div className="story-grid">
        {cards.map((card, idx) => (
          <div className={`story-card ${card.variant}`} key={idx}>
            <div className="story-number">{card.number}</div>
            <h3 className="story-card-title">{card.title}</h3>
            <p className="story-card-desc">{card.desc}</p>
            <div className="story-image-circle">
              <img src={card.img} alt={card.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurStorySection;