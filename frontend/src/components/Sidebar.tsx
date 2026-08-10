import React from 'react';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Image,
  Video,
  BarChart3,
  Database,
  BrainCircuit,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Waves,
  MapPin,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  darkMode?: boolean;
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  darkMode = true,
  selectedRegion,
  onSelectRegion,
  selectedModel,
  onSelectModel,
}) => {
  const menuItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'image-detection', label: 'Image Detection', icon: Image },
    { id: 'video-detection', label: 'Video Stream', icon: Video, badge: '60 FPS' },
    { id: 'analytics', label: 'Analytics & Maps', icon: BarChart3 },
  ];

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

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavList = (isMobile: boolean = false) => (
    <div className="p-3 space-y-1 overflow-y-auto flex-1">
      {(!collapsed || isMobile) && (
        <div className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 font-bold mb-1 ${
          darkMode ? 'text-slate-400' : 'text-slate-600 font-semibold'
        }`}>
          Navigation Menu
        </div>
      )}
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-sans transition-all group relative cursor-pointer ${
              isActive
                ? darkMode
                  ? 'bg-[#1F2937] text-[#F59E0B] font-bold shadow-xs'
                  : 'bg-amber-100/70 text-amber-950 font-bold shadow-xs border border-amber-300/60'
                : darkMode
                ? 'hover:bg-[#1F2937]/60 text-slate-300 hover:text-[#F59E0B]'
                : 'hover:bg-slate-100 text-slate-800 font-medium hover:text-amber-800'
            }`}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#F59E0B]' : darkMode ? 'text-slate-400 group-hover:text-[#F59E0B]' : 'text-slate-500 group-hover:text-[#D97706]'
              }`}
            />

            {(!collapsed || isMobile) && (
              <span className="truncate flex-1 text-left tracking-tight">{item.label}</span>
            )}

            {(!collapsed || isMobile) && item.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                  item.badge === 'Live' || item.badge === '60 FPS'
                    ? darkMode
                      ? 'bg-[#0B1120] text-[#34D399] border border-[#34D399]/40'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : darkMode
                    ? 'bg-[#0B1120] text-[#F59E0B] border border-[#F59E0B]/40'
                    : 'bg-amber-50 text-[#D97706] border border-amber-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Mobile Selectors Section */}
      {isMobile && selectedRegion && onSelectRegion && (
        <div className="pt-4 mt-4 border-t border-[#60A5FA]/20 space-y-3 font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#F59E0B] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Monitoring Station
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="w-full bg-[#1A233A] border border-[#60A5FA]/30 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-[#F59E0B] text-xs font-sans"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {selectedModel && onSelectModel && (
            <div>
              <div className="text-[10px] text-[#F59E0B] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Neural Model
              </div>
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="w-full bg-[#1A233A] border border-[#60A5FA]/30 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-[#F59E0B] text-xs font-sans"
              >
                {models.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop & Drawer (md:hidden) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-in Panel */}
          <div className="relative w-72 max-w-[85vw] bg-[#0B132B] h-full shadow-2xl flex flex-col justify-between border-r border-[#60A5FA]/20 z-10 animate-in slide-in-from-left duration-200 text-slate-200">
            {/* Mobile Header */}
            <div className="p-4 border-b border-[#60A5FA]/20 flex justify-between items-center bg-[#1A233A]">
              <div className="flex items-center gap-2 font-mono font-bold text-slate-100 text-sm">
                <div className="flex items-center justify-center w-7 h-7 rounded bg-[#F59E0B] text-slate-950 font-black">
                  <Waves className="w-4 h-4 text-slate-950" />
                </div>
                <span>NIRMAL<span className="text-[#F59E0B]">SAGAR</span></span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#F59E0B] hover:bg-[#253252] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            {renderNavList(true)}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside
        className={`hidden md:flex fixed top-14 left-0 bottom-0 z-30 transition-all duration-200 flex-col justify-between border-r ${
          darkMode
            ? 'bg-[#0B1120] border-[#374151] text-slate-300'
            : 'bg-white border-slate-200 text-slate-700'
        } ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Top Menu Items */}
        {renderNavList(false)}

        {/* Bottom ROV Status & Collapse Toggle */}
        <div className={`p-3 border-t space-y-3 ${
          darkMode ? 'border-[#374151] bg-[#0B1120]' : 'border-slate-200 bg-white'
        }`}>
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center justify-center p-2 rounded-lg border transition-colors shadow-xs cursor-pointer text-xs font-medium gap-2 ${
              darkMode
                ? 'bg-[#1F2937] hover:bg-[#374151] border-[#374151] text-slate-300 hover:text-[#F59E0B]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-[#D97706]'
            }`}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-[#F59E0B]" />
                <span className={`font-sans text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

