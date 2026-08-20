import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import MemoryWallShowcase from '../components/landing/MemoryWallShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import ExperiencePreview from '../components/landing/ExperiencePreview';
import FeatureHighlights from '../components/landing/FeatureHighlights';
import PricingSection from '../components/landing/PricingSection';
import FinalCTA from '../components/landing/FinalCTA';

export const LandingPage = () => {
  return (
    <div className="landing-page-root">
      <Header />
      <main id="main-content">
        <Hero />
        <MemoryWallShowcase />
        <HowItWorks />
        <ExperiencePreview />
        <FeatureHighlights />
        <PricingSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
