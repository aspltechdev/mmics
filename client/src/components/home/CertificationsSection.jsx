// client/src/components/home/CertificationsSection.jsx
import React from 'react';
import './CertificationsSection.css';

import ice from "../../assets/iec.png";
import msme from "../../assets/msme.png";
import fieo from "../../assets/fieo.png";
import goi from "../../assets/goi.png";
import mc from "../../assets/mc.png";

const CertificationsSection = () => {
  const logos = [
    { id: 1, src: ice, alt: 'IEC' },
    { id: 2, src: msme, alt: 'MSME' },
    { id: 3, src: fieo, alt: 'FIEO' },
    { id: 4, src: goi, alt: 'Government of India' },
    { id: 5, src: mc, alt: 'Cooperative Society' },
  ];

  return (
    <section className="certifications-section">
      {logos.map((logo) => (
        <img key={logo.id} src={logo.src} alt={logo.alt} className="cert-logo" />
      ))}
    </section>
  );
};

export default CertificationsSection;