import React, { useState } from 'react';
import { PageId } from '../../types';
import { DarkModeToggle } from '../DarkModeToggle';
import {
  User,
  Sliders,
  Key,
  Check,
  Copy,
  Sparkles,
  Database,
  Cpu,
  Info,
  Layers,
  Moon,
  Sun,
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  darkMode = true,
  onToggleDarkMode,
}) => {
  const [apiKey, setApiKey] = useState('ns_demo_9f82a1b0293481239c821a002');
  const [copiedKey, setCopiedKey] = useState(false);
  const [highDensityAlerts, setHighDensityAlerts] = useState(true);
  const [autoDewatering, setAutoDewatering] = useState(true);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              SYSTEM CONFIGURATION
            </span>
            <span className={`font-mono ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>Pipeline & Inference Preferences</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            System Preferences & Pipeline Configuration
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Configure image enhancement presets, detection confidence defaults, and exported GeoJSON payload keys.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: System Summary */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border shadow-md space-y-4 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
              NS
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>NirmalSagar System</h3>
              <p className={`text-xs font-mono font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>Research Prototype v3.2</p>
            </div>
          </div>

          <div className={`space-y-2.5 pt-4 border-t text-xs font-mono ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>PIPELINE SCOPE:</span>
              <span className={`font-bold ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>Enhancement → Detection → Density</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>PRIMARY ARCHITECTURE:</span>
              <span className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>Mask R-CNN / Swin-B</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>EXPORT FORMAT:</span>
              <span className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>COCO JSON / GeoJSON</span>
            </div>
          </div>
        </div>

        {/* Right 8 cols: Settings Sections */}
        <div className="lg:col-span-8 space-y-6">
          {/* API Key Management */}
          <div className={`p-6 rounded-2xl border shadow-md space-y-4 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
              <Key className="w-4 h-4 text-[#FBBF24]" />
              API Key Management
            </h3>

            <div className="space-y-2">
              <label className={`text-xs font-mono block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Sample API Endpoint Access Key</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none border ${
                    darkMode
                      ? 'bg-[#0B132B] border-[#60A5FA]/30 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={handleCopyKey}
                  className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inference Preferences */}
          <div className={`p-6 rounded-2xl border shadow-md space-y-4 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
              <Sliders className="w-4 h-4 text-[#FBBF24]" />
              Preprocessing & Inference Preferences
            </h3>

            <div className="space-y-4 text-xs">
              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Moon className="w-4 h-4 text-[#FBBF24]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <div>
                    <div className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      <span>Dark Mode Appearance</span>
                    </div>
                    <div className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Toggle system theme between dark ocean theme and high-contrast light mode.
                    </div>
                  </div>
                </div>
                {onToggleDarkMode && (
                  <DarkModeToggle
                    darkMode={darkMode}
                    onToggle={onToggleDarkMode}
                    size="md"
                    showLabel={true}
                  />
                )}
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Auto-Apply Underwater Enhancement</div>
                  <div className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Automatically run color correction & dehazing prior to instance segmentation.
                  </div>
                </div>
                <button
                  onClick={() => setAutoDewatering(!autoDewatering)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    autoDewatering
                      ? 'bg-[#FBBF24]'
                      : darkMode ? 'bg-[#1A233A] border border-[#60A5FA]/30' : 'bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-slate-950 shadow-xs transition-transform ${
                      autoDewatering ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>High Marine Pollution Density Alerts</div>
                  <div className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Highlight scans with Debris Density &gt; 10 items/m² or Pollution Score &gt; 75.
                  </div>
                </div>
                <button
                  onClick={() => setHighDensityAlerts(!highDensityAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    highDensityAlerts
                      ? 'bg-[#FBBF24]'
                      : darkMode ? 'bg-[#1A233A] border border-[#60A5FA]/30' : 'bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-slate-950 shadow-xs transition-transform ${
                      highDensityAlerts ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
