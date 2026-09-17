// client/src/components/about/LeadershipSection.jsx
import React from 'react';
import leader1 from '../../assets/leader-1.png';
import leader2 from '../../assets/leader-2.png';
import leader3 from '../../assets/leader-3.png';
import './LeadershipSection.css';

const LeadershipSection = () => {
  const leaders = [
    { name: 'A.Mani', role: 'CEO', img: leader1 },
    { name: 'P.Raghu', role: 'Founder', img: leader2 },
    { name: 'N.Kandane Narayana Swamy', role: 'Vice Chairperson', img: leader3 },
  ];

  return (
    <section className="leadership-section">
      <span className="lead-label">OUR LEADERSHIP</span>

      <h2 className="lead-title">
        Built on <span className="highlight">Strong Leadership</span>
      </h2>

      <div className="leaders-grid">
        {leaders.map((leader) => (
          <div className="leader-card" key={leader.name}>
            <div className="leader-img-wrapper">
              <img src={leader.img} alt={leader.name} />
            </div>

            <h3 className="leader-name">{leader.name}</h3>
            <p className="leader-role">{leader.role}</p>

            <div className="leader-socials">
              {/* Facebook */}
              <a href="#" aria-label="Facebook">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="#" aria-label="X">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipSection;