import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ onOpenWorkbench }) {
  const scrollToResearch = (e) => {
    e.preventDefault();
    const element = document.getElementById('research');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="ns-hero-root">
      {/* Background Graphic Layer */}
      <div className="ns-hero-bg-graphic" aria-hidden="true">
        <div className="ns-hero-glow-sphere" />
        <div className="ns-hero-grid-mesh" />
      </div>

      <div className="ns-hero-container">
        <div className="ns-hero-content">
          <h1 className="ns-hero-title">
            Underwater Marine Debris<br />
            & Plastic Detection
          </h1>

          <p className="ns-hero-desc">
            Detect and segment submerged plastic waste, abandoned fishing gear, and metal debris in underwater survey imagery.
          </p>

          <div className="ns-hero-actions">
            <button
              onClick={onOpenWorkbench}
              className="ns-hero-btn-primary"
              aria-label="Launch Workbench"
            >
              <span>Analyze</span>
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <button
              onClick={scrollToResearch}
              className="ns-hero-btn-secondary"
              aria-label="Explore research documentation"
            >
              Explore the Research
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
