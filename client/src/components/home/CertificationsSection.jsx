// client/src/components/home/CertificationsSection.jsx
import React from 'react';
import './CertificationsSection.css';

const CertificationsSection = () => {
  // Replace these placeholder URLs with your actual logo image paths
  const logos = [
    { id: 1, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Indian_Embassy_Logo.svg/1200px-Indian_Embassy_Logo.svg.png', alt: 'IEC Import Export Code Licence' },
    { id: 2, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/MSME_Logo.png/800px-MSME_Logo.png', alt: 'MSME' },
    { id: 3, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/FIEO_Logo.png/800px-FIEO_Logo.png', alt: 'FIEO' },
    { id: 4, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png', alt: 'Government of India' },
    { id: 5, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/MSME_Logo.png/800px-MSME_Logo.png', alt: 'Cooperative Society' },
  ];

  return (
    <section className="certifications-section">
      {logos.map((logo) => (
        <img 
          key={logo.id} 
          src={logo.src} 
          alt={logo.alt} 
          className="cert-logo" 
        />
      ))}
    </section>
  );
};

export default CertificationsSection;