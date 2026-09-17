// client/src/components/home/MembershipSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
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
      <Link to="/about" className="btn-white">
        Explore Membership <ArrowRight size={18} />
      </Link>
    </section>
  );
};

export default MembershipSection;