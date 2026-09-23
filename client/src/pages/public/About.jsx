// client/src/pages/public/About.jsx
import React from 'react';
import AboutHero from '../../components/about/AboutHero';
import WhoWeAreSection from '../../components/about/WhoWeAreSection';
import OurStorySection from '../../components/about/OurStorySection';
import MissionVisionSection from '../../components/about/MissionVisionSection';
import CoreValuesSection from '../../components/about/CoreValuesSection';
import BenefitsVideoSection
  from "../../components/about/BenefitsVideoSection";
//import LeadershipSection from '../../components/about/LeadershipSection';
import ContactCtaSection from '../../components/about/ContactCtaSection';

const About = () => {
  return (
    <main>
      <AboutHero />
      <WhoWeAreSection />
      <OurStorySection />
      <MissionVisionSection />
      <CoreValuesSection />
      <BenefitsVideoSection />
      {/* <LeadershipSection /> */}
      <ContactCtaSection />
    </main>
  );
};

export default About;