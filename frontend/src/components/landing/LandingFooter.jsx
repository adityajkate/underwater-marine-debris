import React from 'react';
import BrandLogo from '../common/BrandLogo';

export default function LandingFooter() {
  return (
    <footer className="ns-footer-root">
      <div className="ns-footer-container">
        <div className="ns-footer-left">
          <BrandLogo theme="light" size="md" />
          <p className="ns-footer-tagline">
            Underwater marine debris detection and density mapping.
          </p>
        </div>

        <div className="ns-footer-center-contributors">
          <h4 className="ns-footer-heading">Contributors</h4>
          <p className="ns-footer-contributors-list">
            <span>Aditya Kate</span>
            <span className="ns-footer-sep">•</span>
            <span>Suman Manik</span>
            <span className="ns-footer-sep">•</span>
            <span>Tanmay Harmalkar</span>
            <span className="ns-footer-sep">•</span>
            <span>Abdullah Khan</span>
          </p>
        </div>

        <div className="ns-footer-right">
          <p className="ns-footer-copyright">
            © NirmalSagar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
