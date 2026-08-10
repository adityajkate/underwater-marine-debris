import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/pages/DashboardPage';
import { ImageDetectionPage } from './components/pages/ImageDetectionPage';
import { VideoDetectionPage } from './components/pages/VideoDetectionPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { DatasetManagementPage } from './components/pages/DatasetManagementPage';
import { ModelTrainingPage } from './components/pages/ModelTrainingPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('Mumbai Coast - Station 01');
  const [selectedModel, setSelectedModel] = useState<string>('NirmalSagar-v3.2 ViT-DomainAdapt');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#FBBF24] selection:text-slate-950 transition-colors duration-300 ${
      darkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Top Fixed Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="flex relative">
        {/* Left Collapsible Sidebar & Mobile Drawer */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          darkMode={darkMode}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* Main Content Viewport */}
        <main
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-3.5rem)] w-full max-w-full overflow-x-hidden ${
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
          } ml-0`}
        >
          {currentPage === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} selectedRegion={selectedRegion} darkMode={darkMode} />
          )}
          {currentPage === 'image-detection' && <ImageDetectionPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'video-detection' && <VideoDetectionPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'dataset' && <DatasetManagementPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'training' && <ModelTrainingPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'reports' && <ReportsPage onNavigate={handleNavigate} darkMode={darkMode} />}
          {currentPage === 'settings' && (
            <SettingsPage
              onNavigate={handleNavigate}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

