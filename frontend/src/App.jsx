import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ImageAnalysisWorkspace from './components/ImageAnalysisWorkspace';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeTab, setActiveTab] = useState('image-analysis');

  // Handler to open Image Analysis workspace from Landing Page or console
  const handleNavigateToAnalysis = () => {
    setCurrentPage('console');
    setActiveTab('image-analysis');
  };

  // Handler to return to Landing Page
  const handleNavigateHome = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <LandingPage onNavigateToAnalysis={handleNavigateToAnalysis} />;
  }

  return (
    <div className="ns-app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <div className="ns-main-wrapper">
        {/* Top Console Header */}
        <Header />

        {/* Workspace view depending on active navigation tab */}
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateToAnalysis={handleNavigateToAnalysis} />
        )}
        {activeTab === 'image-analysis' && (
          <ImageAnalysisWorkspace />
        )}
        {activeTab !== 'dashboard' && activeTab !== 'image-analysis' && (
          <div className="ns-workspace-layout">
            <div className="ns-card" style={{ padding: '48px', textAlign: 'center', gridColumn: 'span 2' }}>
              <h2 className="ns-page-title" style={{ marginBottom: '12px' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/-/g, ' ')}
              </h2>
              <p className="ns-page-subtitle">
                This feature module is queued for future release. Please switch to <strong>Image Analysis</strong>.
              </p>
              <button
                type="button"
                className="ns-btn ns-btn-primary"
                style={{ marginTop: '24px' }}
                onClick={handleNavigateToAnalysis}
              >
                Go to Image Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
