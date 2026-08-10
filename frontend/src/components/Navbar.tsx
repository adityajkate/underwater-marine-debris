import React, { useState } from 'react';
import { PageId } from '../types';
import { DarkModeToggle } from './DarkModeToggle';
import {
  Waves,
  Search,
  Bell,
  Cpu,
  MapPin,
  ChevronDown,
  Sparkles,
  Radio,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  selectedRegion,
  onSelectRegion,
  selectedModel,
  onSelectModel,
  mobileMenuOpen,
  onToggleMobileMenu,
  sidebarCollapsed,
  onToggleSidebar,
  darkMode = true,
  onToggleDarkMode,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  const regions = [
    'Mumbai Coast - Station 01',
    'Bay of Bengal - Station 04',
    'Gulf of Mannar - Station 02',
    'Kochi Estuary - Station 07',
    'Lakshadweep Lagoon - Station 09',
    'Andaman Channel - Station 12',
  ];

  const models = [
    'NirmalSagar-v3.2 ViT-DomainAdapt',
    'NirmalSagar-v3.1 SegFormer-Marine',
    'YOLOv9-MarineAdapt-Baseline',
  ];

  const pageTitles: Record<PageId, string> = {
    landing: 'Platform Overview',
    dashboard: 'Monitoring & Analytics Dashboard',
    'image-detection': 'Image Litter Detection & Segmentation',
    'video-detection': 'ROV Video Stream Analysis',
    analytics: 'Spatial & Domain Shift Metrics',
    dataset: 'Marine Debris Repository',
    training: 'Model Training & Evaluation',
    reports: 'Environmental Reports',
    settings: 'System Configuration',
    enhancement: 'Underwater Enhancement Studio',
    'pollution-analysis': 'Pollution Heatmap & Priority Queue',
  };

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
      darkMode
        ? 'bg-[#0B1120] border-[#374151] text-slate-100 shadow-md'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs backdrop-blur-md'
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile & Desktop Sidebar Toggle, Brand Identity & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Sidebar / Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                onToggleMobileMenu?.();
              } else {
                onToggleSidebar?.();
              }
            }}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              darkMode
                ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            aria-label="Toggle navigation menu"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {mobileMenuOpen || (!sidebarCollapsed && window.innerWidth >= 768) ? (
              <X className="w-5 h-5 text-[#F59E0B]" />
            ) : (
              <Menu className="w-5 h-5 text-[#F59E0B]" />
            )}
          </button>

          {/* Top-Left Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F59E0B] text-slate-950 font-black shadow-md group-hover:bg-[#D97706] transition-colors">
              <Waves className="w-4 h-4 text-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-bold text-sm sm:text-base tracking-tight font-mono ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  NIRMAL<span className="text-[#F59E0B]">SAGAR</span>
                </span>
                <span className={`text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded border font-semibold ${
                  darkMode ? 'bg-[#1F2937] text-[#F59E0B] border-[#F59E0B]/40' : 'bg-amber-50 text-[#D97706] border-amber-300'
                }`}>
                  v3.2
                </span>
              </div>
            </div>
          </div>

          {/* Divider & Current Screen Title */}
          <div className={`hidden sm:block h-4 w-px mx-1 ${darkMode ? 'bg-[#374151]' : 'bg-slate-300'}`} />
          <div className="hidden sm:block text-slate-300">
            <span className="text-[#F59E0B] font-sans font-semibold text-xs sm:text-sm">{pageTitles[currentPage]}</span>
          </div>
        </div>

        {/* Right: Region & Model Selectors, Dark Mode Toggle, Stats, Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Region Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span className="truncate max-w-[130px] font-medium">{selectedRegion}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {regionMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl p-2 z-50 border ${
                darkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[10px] font-mono text-[#F59E0B] px-2 py-1 uppercase tracking-wider font-semibold">
                  Monitoring Station
                </div>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      onSelectRegion(reg);
                      setRegionMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedRegion === reg
                        ? darkMode
                          ? 'bg-[#0B1120] text-[#F59E0B] font-semibold border border-[#F59E0B]/40'
                          : 'bg-amber-50 text-[#D97706] font-semibold border border-amber-200'
                        : darkMode
                        ? 'text-slate-300 hover:bg-[#374151]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{reg}</span>
                    {selectedRegion === reg && <Radio className="w-3 h-3 text-[#F59E0B]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-[#F59E0B]'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-[#D97706]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="truncate max-w-[140px] font-medium">{selectedModel.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {modelMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl p-2 z-50 border ${
                darkMode ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-slate-200'
              }`}>
                <div className="text-[10px] font-mono text-[#F59E0B] px-2 py-1 uppercase tracking-wider font-semibold">
                  Neural Architecture
                </div>
                {models.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => {
                      onSelectModel(mod);
                      setModelMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedModel === mod
                        ? darkMode
                          ? 'bg-[#0B1120] text-[#F59E0B] font-semibold border border-[#F59E0B]/40'
                          : 'bg-amber-50 text-[#D97706] font-semibold border border-amber-200'
                        : darkMode
                        ? 'text-slate-300 hover:bg-[#374151]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-mono">{mod}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Dark Mode Pill Toggle Switch */}
          {onToggleDarkMode && (
            <div className="flex items-center">
              <DarkModeToggle
                darkMode={darkMode}
                onToggle={onToggleDarkMode}
                size="sm"
              />
            </div>
          )}

          {/* Top-Right Stats Row */}
          <div className={`hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border text-xs font-mono ${
            darkMode
              ? 'bg-[#1F2937] border-[#374151] text-slate-200'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Accuracy:</span>
              <span className="text-[#F59E0B] font-bold">94.8%</span>
            </div>

          </div>

          {/* Search trigger */}
          <button
            onClick={() => onNavigate('dataset')}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              darkMode
                ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-slate-300 hover:text-[#F59E0B]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-[#F59E0B]'
            }`}
            title="Search Repository"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-slate-300 hover:text-[#F59E0B]'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-[#F59E0B]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB7185]" />
            </button>

            {notificationsOpen && (
              <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl p-3 z-50 text-xs font-sans border ${
                darkMode ? 'bg-[#1F2937] border-[#374151] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className={`flex justify-between items-center mb-2 pb-2 border-b ${
                  darkMode ? 'border-[#374151]' : 'border-slate-200'
                }`}>
                  <span className="font-bold text-[#F59E0B] flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> Station Alerts
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">2 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#FB7185]/15 border border-[#FB7185]/40 text-slate-800 dark:text-slate-100">
                    <div className="font-semibold text-[11px] text-[#FB7185]">High Density Debris Alert</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Station 04 (Visakhapatnam) detected high marine debris concentration.
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${
                    darkMode ? 'bg-[#0B1120] border-[#374151] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="font-semibold text-[11px] text-[#F59E0B]">ROV Autonomous Survey Complete</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Station 01 survey logged 12.8 items/m² density. Turbidity score 78.4 FTU.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 p-1 pr-2.5 rounded-lg border cursor-pointer transition-colors ${
              darkMode
                ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-slate-950 font-black text-xs font-mono shadow-xs flex items-center justify-center">
              NS
            </div>
            <div className="hidden sm:block text-left text-xs font-sans">
              <div className={`font-semibold text-[11px] ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Research Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

