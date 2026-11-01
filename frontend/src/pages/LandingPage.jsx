import React from 'react';
import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import InsightCardsSection from '../components/landing/InsightCardsSection';
import AnalysisWorkflowSection from '../components/landing/AnalysisWorkflowSection';
import ResearchSection from '../components/landing/ResearchSection';
import CtaBanner from '../components/landing/CtaBanner';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/landing.css';

export default function LandingPage({ onOpenWorkbench }) {
  return (
    <>
      <LandingNav onOpenWorkbench={onOpenWorkbench} />

      <div className="ns-landing-root">
        <main>
          <HeroSection onOpenWorkbench={onOpenWorkbench} />
          <InsightCardsSection />
          <AnalysisWorkflowSection />
          <ResearchSection />
          <CtaBanner onOpenWorkbench={onOpenWorkbench} />
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
