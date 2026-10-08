import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Sparkles,
  ShieldAlert,
  BarChart3,
  Clock,
  Settings,
  ArrowLeft,
  Menu,
  X,
  RefreshCw,
  Sliders,
  FlaskConical,
  Radio,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import StatusBadge from '../common/StatusBadge';
import SettingsModal from './SettingsModal';
import DashboardView from './DashboardView';
import ImageAnalysisWorkbench from './ImageAnalysisWorkbench';
import VideoDetectionView from './VideoDetectionView';
import UnderwaterEnhancementView from './UnderwaterEnhancementView';
import PollutionAnalysisView from './PollutionAnalysisView';
import AnalyticsView from './AnalyticsView';
import HistoryView from './HistoryView';
import { useAnalysis } from '../../context/AnalysisContext';
import '../../styles/workbench.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'image-detection', label: 'Image Detection', icon: ImageIcon },
  { id: 'video-detection', label: 'Video Detection', icon: Video },
  { id: 'underwater-enhancement', label: 'Underwater Enhancement', icon: Sparkles },
  { id: 'pollution-analysis', label: 'Pollution Analysis', icon: ShieldAlert },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'history', label: 'History', icon: Clock },
];

export default function ConsoleLayout({ onReturnToLanding }) {
  const { activeTab, setActiveTab, backendStatus, checkBackendHealth } = useAnalysis();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when tab changes or resize to desktop
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeNavItem = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];

  return (
    <div className="ns-console-root">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="ns-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. Primary Left Sidebar */}
      <aside className={`ns-sidebar ${isMobileMenuOpen ? 'ns-sidebar-mobile-open' : ''}`}>
        <div className="ns-sidebar-top">
          {/* Brand Header */}
          <div className="ns-sidebar-brand-wrapper">
            <div
              className="ns-sidebar-brand"
              onClick={onReturnToLanding}
              title="Return to Landing Page"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onReturnToLanding()}
            >
              <BrandLogo theme="dark" size="md" />
            </div>

            {/* Mobile close drawer button */}
            <button
              className="ns-mobile-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Model / Engine Status Pill */}
          <div
            className="ns-sidebar-mode-badge is-real"
            onClick={() => setIsSettingsOpen(true)}
            title="Click to view Inference & Mode Preferences"
            role="button"
            tabIndex={0}
          >
            <div className="ns-mode-dot-wrap">
              <span className="ns-mode-dot dot-real" />
            </div>
            <div className="ns-mode-text-wrap">
              <span className="ns-mode-title">Detection Engine</span>
              <span className="ns-mode-sub">
                {backendStatus.isOnline ? 'FastAPI Connected' : 'Pipeline Ready'}
              </span>
            </div>
          </div>

          {/* Nav Items (All 7 required primary sections) */}
          <nav className="ns-sidebar-nav" aria-label="Primary Console Navigation">
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`ns-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Backend Status & Settings */}
        <div className="ns-sidebar-bottom">
          <div
            className="ns-sidebar-status-box"
            onClick={checkBackendHealth}
            title={`Click to re-check backend (${backendStatus.isOnline ? 'Online' : 'Offline'})`}
            role="button"
            tabIndex={0}
          >
            <div className="ns-status-indicator-dot-wrap">
              <span
                className={`ns-status-dot-pulse ${
                  backendStatus.isOnline ? 'dot-online' : 'dot-offline'
                }`}
              />
            </div>
            <div className="ns-sidebar-status-text">
              <span className="ns-status-text-main">
                {backendStatus.isOnline ? 'YOLO API Online' : 'Backend Offline'}
              </span>
              <span className="ns-status-text-sub">
                {backendStatus.isOnline ? `${backendStatus.latencyMs}ms` : 'localhost:8000'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="ns-nav-item ns-settings-item"
            title="Console Settings"
          >
            <Settings size={18} />
            <span>Preferences</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Console Stage */}
      <div className="ns-console-main">
        {/* Top Header Bar */}
        <header className="ns-console-topbar">
          <div className="ns-topbar-left">
            {/* Hamburger button for tablet/mobile */}
            <button
              className="ns-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Section Title */}
            <div className="ns-breadcrumb-trail">
              <span className="ns-breadcrumb-root">NirmalSagar</span>
              <span className="ns-breadcrumb-slash">/</span>
              <span className="ns-breadcrumb-current">{activeNavItem.label}</span>
            </div>
          </div>

          <div className="ns-topbar-right">
            {/* Model Tag */}
            <div
              className="ns-demo-global-tag tag-real"
              onClick={() => setIsSettingsOpen(true)}
              title="Click to view Inference & Mode Preferences"
              role="button"
              tabIndex={0}
            >
              <span className="ns-tag-dot" />
              <span>YOLOv11s • Marine Debris Detection</span>
            </div>

            {/* Live Backend Badge */}
            <div
              className={`ns-topbar-status-badge ${
                backendStatus.isOnline ? 'is-online' : 'is-offline'
              }`}
              onClick={checkBackendHealth}
              title="Click to check backend status"
              role="button"
              tabIndex={0}
            >
              <span className="ns-badge-dot" />
              <span>{backendStatus.isOnline ? 'API READY' : 'API OFFLINE'}</span>
            </div>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="ns-topbar-icon-btn"
              title="Preferences"
              aria-label="System Preferences"
            >
              <Sliders size={17} />
            </button>

            {/* Back to Landing */}
            <button
              onClick={onReturnToLanding}
              className="ns-back-landing-btn"
              title="Return to Home"
            >
              <ArrowLeft size={14} />
              <span>Exit Console</span>
            </button>
          </div>
        </header>

        {/* Dynamic Section Stage */}
        <main className="ns-console-content">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={handleNavClick} />
          )}
          {activeTab === 'image-detection' && (
            <ImageAnalysisWorkbench onNavigate={handleNavClick} />
          )}
          {activeTab === 'video-detection' && (
            <VideoDetectionView onNavigate={handleNavClick} />
          )}
          {activeTab === 'underwater-enhancement' && (
            <UnderwaterEnhancementView onNavigate={handleNavClick} />
          )}
          {activeTab === 'pollution-analysis' && (
            <PollutionAnalysisView onNavigate={handleNavClick} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView onNavigate={handleNavClick} />
          )}
          {activeTab === 'history' && (
            <HistoryView onNavigate={handleNavClick} />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
