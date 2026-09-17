// client/src/components/home/MembershipSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import './MembershipSection.css';

const MembershipSection = () => {
  return (
    <section className="membership-section">
      <span className="membership-label">MEMBERSHIP</span>
      <h2 className="membership-title">
        Grow Together <span className="highlight">With MMMICS</span>
      </h2>
      <p className="membership-desc">
        Be part of a cooperative community working towards shared growth and opportunity.
      </p>
      <button className="btn-white">Explore Membership <ArrowRight size={18} /></button>
    </section>
  );
};

export default MembershipSection;