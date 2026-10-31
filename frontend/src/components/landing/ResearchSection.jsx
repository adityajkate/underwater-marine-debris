import React from 'react';
import { Check } from 'lucide-react';

export default function ResearchSection() {
  const features = [
    {
      title: 'Object Localization',
      desc: 'Pinpoints debris boundaries even when partially covered by sediment or marine growth.',
    },
    {
      title: 'Underwater Light Handling',
      desc: 'Trained to distinguish debris despite color distortion and light absorption at depth.',
    },
    {
      title: 'Multi-Category Detection',
      desc: 'Differentiates between plastic bottles, bags, derelict nets, and metal scrap.',
    },
    {
      title: 'Density Calculation',
      desc: 'Calculates debris counts per square meter to help survey teams prioritize cleanup sites.',
    },
  ];

  return (
    <section id="research" className="ns-research-root">
      <div className="ns-research-container">
        {/* Left Column: Research Content & Checklist */}
        <div className="ns-research-col-left">
          <div className="ns-sub-tag">METHODOLOGY</div>

          <h2 className="ns-research-title">
            Trained for Underwater Environments
          </h2>

          <p className="ns-research-intro">
            Underwater imagery suffers from turbidity, backscatter, and uneven lighting.
            NirmalSagar uses models trained on benthic datasets to reliably detect submerged
            marine debris in real-world surveys.
          </p>

          <div className="ns-feature-list">
            {features.map((item, index) => (
              <div key={index} className="ns-feature-item">
                <div className="ns-feature-check">
                  <Check size={13} strokeWidth={2.8} />
                </div>
                <div className="ns-feature-content">
                  <h3 className="ns-feature-title">{item.title}</h3>
                  <p className="ns-feature-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
