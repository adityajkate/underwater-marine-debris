import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner({ onOpenWorkbench }) {
  return (
    <section className="ns-cta-root">
      <div className="ns-cta-container">
        <h2 className="ns-cta-title">
          Ready to detect marine debris?
        </h2>

        <p className="ns-cta-desc">
          Upload underwater survey footage to locate plastics, derelict nets, and metal waste.
        </p>

        <div className="ns-cta-action">
          <button
            onClick={onOpenWorkbench}
            className="ns-cta-btn"
          >
            <span>Analyze</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
