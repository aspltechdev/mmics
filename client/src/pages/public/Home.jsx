// client/src/pages/public/Home.jsx

import React from "react";

import Hero from "../../components/home/Hero";
import AboutSection from "../../components/home/AboutSection";
import ProductSection from "../../components/home/ProductSection";
import IndustriesSection from "../../components/home/IndustriesSection";
import WhyMmmicsSection from "../../components/home/WhyMmmicsSection";
import CertificationsSection from '../../components/home/CertificationsSection';
import ProcessSection from "../../components/home/ProcessSection";
import CustomizationSection from "../../components/home/CustomizationSection";
import MembershipSection from "../../components/home/MembershipSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import GallerySection from "../../components/home/GallerySection";
import FaqSection from "../../components/home/FaqSection";
import ContactSection from "../../components/home/ContactSection";

const Home = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <ProductSection />
      <IndustriesSection />
      <WhyMmmicsSection />
      <CertificationsSection />
      <ProcessSection />
      <CustomizationSection />
      <MembershipSection />
      <TestimonialsSection />
      <GallerySection />
      <FaqSection />
      <ContactSection />
    </>
  );
};

export default Home;