import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  darkMode,
  onToggle,
  size = 'md',
  showLabel = false,
}) => {
  // Dimensions based on size
  const containerClasses = {
    sm: 'w-14 h-7 p-0.5',
    md: 'w-16 h-8 p-1',
    lg: 'w-20 h-10 p-1',
  }[size];

  const knobSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  const translateClasses = {
    sm: darkMode ? 'translate-x-0' : 'translate-x-7',
    md: darkMode ? 'translate-x-0' : 'translate-x-8',
    lg: darkMode ? 'translate-x-0' : 'translate-x-10',
  }[size];

  const iconClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        type="button"
        className={`relative inline-flex items-center rounded-full transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2 ${containerClasses} ${
          darkMode
            ? 'bg-[#18181B] border-2 border-[#3F3F46] shadow-inner'
            : 'bg-[#FF5722] border-2 border-[#F4511E] shadow-inner'
        }`}
        aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={`Dark Mode is ${darkMode ? 'ON' : 'OFF'}. Click to toggle.`}
      >
        {/* Left Side: Sun Icon (When light mode, or track icon) */}
        <div
          className={`absolute left-2 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            darkMode ? 'opacity-30 text-slate-500' : 'opacity-100 text-white'
          }`}
        >
          <Sun className={`${iconClasses} stroke-[2.5]`} />
        </div>

        {/* Right Side: Moon Icon (When dark mode, or track icon) */}
        <div
          className={`absolute right-2 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            darkMode ? 'opacity-100 text-white' : 'opacity-30 text-orange-200'
          }`}
        >
          <Moon className={`${iconClasses} stroke-[2.5]`} />
        </div>

        {/* Sliding White Knob Circle */}
        <span
          className={`${knobSizeClasses} ${translateClasses} rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10`}
        />
      </button>

      {showLabel && (
        <span className="text-xs font-mono font-bold uppercase tracking-wider">
          {darkMode ? (
            <span className="text-[#FBBF24] flex items-center gap-1">
              <span>Dark</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#1A233A] border border-[#FBBF24]/30">ON</span>
            </span>
          ) : (
            <span className="text-amber-800 flex items-center gap-1">
              <span>Light</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 border border-amber-300">OFF</span>
            </span>
          )}
        </span>
      )}
    </div>
  );
};
