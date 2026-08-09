import React from 'react';

export default function Header() {
  return (
    <header className="ns-header">
      <div className="ns-header-left">
        <div className="ns-console-tag">
          <span className="ns-console-icon"></span>
          OCEANIC INTELLIGENCE CONSOLE
        </div>
      </div>
      <div className="ns-header-right">
        <button type="button" className="ns-header-icon-btn" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button type="button" className="ns-header-icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
