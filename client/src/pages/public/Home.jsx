// client/src/pages/public/Home.jsx

import React from "react";

// Sections in correct order
import Hero from "../../components/home/Hero";
import AboutSection from "../../components/home/AboutSection";
import WhyMmmicsSection from "../../components/home/WhyMmmicsSection";
import ProductSection from "../../components/home/ProductSection";
import IndustriesSection from "../../components/home/IndustriesSection";
import CertificationsSection from "../../components/home/CertificationsSection";
import ProcessSection from "../../components/home/ProcessSection";
import CustomizationSection from "../../components/home/CustomizationSection";
import MembershipSection from "../../components/home/MembershipSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import GallerySection from "../../components/home/GallerySection";
import FaqSection from "../../components/home/FaqSection";
import ContactSection from "../../components/home/ContactSection";

const Home = () => {
  return (
    <main>
      {/* 1. Hero */}
      <Hero />

      {/* 2. About */}
      <AboutSection />

      {/* 3. Why MMMICS */}
      <WhyMmmicsSection />

      {/* 4. Our Solutions (Products) */}
      <ProductSection />

      {/* 5. Industries We Serve */}
      <IndustriesSection />

      {/* 6. Certifications */}
      <CertificationsSection />

      {/* 7. Process (Simple & Reliable) */}
      <ProcessSection />

      {/* 8. Customization */}
      <CustomizationSection />

      {/* 9. Membership */}
      <MembershipSection />

      {/* 10. Testimonials (Customer Experiences) */}
      <TestimonialsSection />

      {/* 11. Gallery (Our Work in Action) */}
      <GallerySection />

      {/* 12. FAQ (Common Questions) */}
      <FaqSection />

      {/* 13. Contact CTA (Let's Connect) */}
      <ContactSection />
    </main>
  );
};

export default Home;