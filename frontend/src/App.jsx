import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ImageAnalysisWorkspace from './components/ImageAnalysisWorkspace';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('image-analysis');

  return (
    <div className="ns-app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="ns-main-wrapper">
        {/* Top Console Header */}
        <Header />

        {/* Workspace view depending on active navigation tab */}
        {activeTab === 'image-analysis' ? (
          <ImageAnalysisWorkspace />
        ) : (
          <div className="ns-workspace-layout">
            <div className="ns-card" style={{ padding: '48px', textAlign: 'center', gridColumn: 'span 2' }}>
              <h2 className="ns-page-title" style={{ marginBottom: '12px' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h2>
              <p className="ns-page-subtitle">
                This feature module is queued for future release. Please switch to <strong>Image Analysis</strong>.
              </p>
              <button
                type="button"
                className="ns-btn ns-btn-primary"
                style={{ marginTop: '24px' }}
                onClick={() => setActiveTab('image-analysis')}
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
