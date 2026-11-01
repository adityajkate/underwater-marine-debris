import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export default function LandingNav({ onOpenWorkbench }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="ns-nav-wrapper">
      <header className="ns-nav-pill">
        {/* Brand */}
        <div className="ns-nav-left">
          <BrandLogo theme="dark" size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>

        {/* Center Links */}
        <nav className="ns-nav-center">
          <ul className="ns-nav-list">
            <li>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="ns-nav-link">
                About
              </a>
            </li>
            <li>
              <a href="#research" onClick={(e) => scrollToSection(e, 'research')} className="ns-nav-link">
                Research
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="ns-nav-link">
                How It Works
              </a>
            </li>
            <li>
              <a href="#contributors" onClick={(e) => scrollToSection(e, 'contributors')} className="ns-nav-link">
                Contributors
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="ns-nav-right">
          <button onClick={onOpenWorkbench} className="ns-btn-primary ns-nav-cta" title="Launch Image Analysis Console">
            Analyze Image
          </button>

          {/* Mobile hamburger with contextual icon cross-fade */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ns-nav-mobile-toggle"
            aria-label="Toggle Navigation"
            aria-expanded={mobileOpen}
          >
            <div className="ns-icon-swap-container">
              <span className={`ns-icon-swap ${!mobileOpen ? 'ns-icon-visible' : 'ns-icon-hidden'}`}>
                <Menu size={18} strokeWidth={2} />
              </span>
              <span className={`ns-icon-swap ${mobileOpen ? 'ns-icon-visible' : 'ns-icon-hidden'}`}>
                <X size={18} strokeWidth={2} />
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="ns-nav-mobile-menu">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="ns-mobile-link">
              About
            </a>
            <a href="#research" onClick={(e) => scrollToSection(e, 'research')} className="ns-mobile-link">
              Research
            </a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="ns-mobile-link">
              How It Works
            </a>
            <a href="#contributors" onClick={(e) => scrollToSection(e, 'contributors')} className="ns-mobile-link">
              Contributors
            </a>
            <button onClick={onOpenWorkbench} className="ns-btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Analyze Image
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
