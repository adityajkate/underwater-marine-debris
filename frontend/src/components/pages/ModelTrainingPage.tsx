import React, { useState } from 'react';
import { PageId } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Cpu,
  Activity,
  SlidersHorizontal,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ModelTrainingPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const ModelTrainingPage: React.FC<ModelTrainingPageProps> = ({ onNavigate, darkMode = true }) => {
  const [devEnv, setDevEnv] = useState<string>('Google Colab GPU (T4/V100)');
  const [selectedArch, setSelectedArch] = useState('Mask R-CNN (Swin-B Backbone)');
  const [isTraining, setIsTraining] = useState(false);

  // Row 1: Augmentation toggles state ("Rotation", "Color Jitter", "Blur")
  const [augStates, setAugStates] = useState({
    Rotation: true,
    'Color Jitter': true,
    Blur: false,
  });

  const toggleAug = (key: keyof typeof augStates) => {
    setAugStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Row 2: Domain toggles state ("Source Domain", "Target Domain", "Clear Water Dataset", "Turbid Coastal Waters")
  const [domainStates, setDomainStates] = useState({
    'Source Domain': true,
    'Target Domain': false,
    'Clear Water Dataset': true,
    'Turbid Coastal Waters': false,
  });

  const toggleDomain = (key: keyof typeof domainStates) => {
    setDomainStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Simulated loss & mAP curve data
  const lossData = [
    { epoch: 10, loss: 0.85, mAP: 0.42 },
    { epoch: 25, loss: 0.62, mAP: 0.58 },
    { epoch: 50, loss: 0.41, mAP: 0.74 },
    { epoch: 75, loss: 0.28, mAP: 0.83 },
    { epoch: 100, loss: 0.19, mAP: 0.89 },
    { epoch: 125, loss: 0.142, mAP: 0.948 },
  ];

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#111827] text-slate-100' : 'bg-[#F3F4F6] text-slate-900'
    }`}>
      {/* Header Area */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        darkMode ? 'bg-[#1F2937] border-[#374151] shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
              darkMode ? 'bg-[#0B1120] text-[#F59E0B] border-[#F59E0B]/30' : 'bg-amber-50 text-[#D97706] border-amber-200'
            }`}>
              NIRMALSAGAR v3.2
            </span>
            <span className={`font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Underwater AI Model Training Platform</span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${
              darkMode ? 'bg-[#0B1120] text-[#34D399] border-[#34D399]/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              ONLINE / CUDA READY
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Model Architecture, Augmentation & Domain Adaptation
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Train and evaluate baseline instance segmentation architectures with synthetic turbidity augmentation and adversarial domain adaptation.
          </p>
        </div>

        <button
          onClick={() => setIsTraining(!isTraining)}
          className={`px-5 py-2.5 rounded-xl font-black text-xs font-mono shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            isTraining
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-[#F59E0B] hover:bg-[#D97706] text-slate-950'
          }`}
        >
          {isTraining ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isTraining ? 'PAUSE TRAINING PIPELINE' : 'EXECUTE MODEL TRAINING'}</span>
        </button>
      </div>

      {/* Top Four Metric Cards in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GPU / Hardware */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="uppercase tracking-wider">HARDWARE / GPU</span>
            <Cpu className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div className={`text-base font-bold font-mono pt-1 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Google Colab GPU (T4/V100)
          </div>
          <p className={`text-[11px] font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>High-throughput CUDA acceleration</p>
        </div>

        {/* Card 2: Architecture */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="uppercase tracking-wider">ARCHITECTURE</span>
            <Layers className="w-4 h-4 text-[#60A5FA]" />
          </div>
          <div className="text-base font-bold font-mono text-[#60A5FA] pt-1">
            Mask R-CNN (<span className="text-[#60A5FA]">Swin-B</span>)
          </div>
          <p className={`text-[11px] font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hierarchical Vision Transformer backbone</p>
        </div>

        {/* Card 3: Domain Gap Index */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="uppercase tracking-wider">DOMAIN GAP INDEX</span>
            <Zap className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-xl font-black font-mono text-[#F59E0B] pt-1">
            0.142 <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>(Adapted)</span>
          </div>
          <p className={`text-[11px] font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reduced from 0.685 baseline gap</p>
        </div>

        {/* Card 4: mAP Metric */}
        <div className={`p-4 rounded-2xl border space-y-1 transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="uppercase tracking-wider">ACCURACY SCORE</span>
            <Activity className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#F59E0B] pt-1">
            mAP@50: 0.948
          </div>
          <p className="text-[11px] text-[#34D399] font-mono font-bold">+18.4% improvement in turbid waters</p>
        </div>
      </div>

      {/* Main Grid: Chart on Left, Config Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center-Right Large Line Chart (7 Columns) */}
        <div className={`lg:col-span-7 p-5 sm:p-6 rounded-2xl border space-y-4 transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
            darkMode ? 'border-[#374151]' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F59E0B]" />
              <h3 className={`font-bold text-sm sm:text-base font-sans ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Loss Convergence & mAP Metric Curve
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-3 h-0.5 bg-[#F59E0B] inline-block rounded-full" />
                Loss Curve
              </span>
              <span className="flex items-center gap-1.5 text-[#34D399]">
                <span className="w-3 h-0.5 bg-[#34D399] inline-block rounded-full" />
                mAP Curve
              </span>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="epoch" stroke={darkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 11, fill: darkMode ? '#9CA3AF' : '#6B7280' }} label={{ value: 'Epochs', position: 'insideBottomRight', offset: -5, fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 11, fill: darkMode ? '#9CA3AF' : '#6B7280' }} />
                <RechartsTooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: darkMode ? '#111827' : '#FFFFFF',
                    borderColor: darkMode ? '#374151' : '#E5E7EB',
                    borderRadius: '8px',
                    color: darkMode ? '#F3F4F6' : '#111827',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: darkMode ? '#9CA3AF' : '#6B7280' }} />
                {/* Amber Loss line */}
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#F59E0B' }}
                  activeDot={{ r: 7 }}
                  name="Loss Convergence"
                />
                {/* Mint Green mAP curve */}
                <Line
                  type="monotone"
                  dataKey="mAP"
                  stroke="#34D399"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#34D399' }}
                  activeDot={{ r: 7 }}
                  name="mAP@50 Metric"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom-Right Config Panel (5 Columns) */}
        <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border space-y-5 flex flex-col justify-between transition-colors ${
          darkMode ? 'bg-[#1F2937] border-[#374151] shadow-md' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-4">
            <div className={`flex items-center gap-2 pb-3 border-b ${darkMode ? 'border-[#374151]' : 'border-slate-200'}`}>
              <SlidersHorizontal className="w-4 h-4 text-[#F59E0B]" />
              <h3 className={`font-bold text-sm sm:text-base font-sans ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Data Augmentation & Domain Config
              </h3>
            </div>

            {/* Row 1: Augmentation Toggles */}
            <div className="space-y-2">
              <label className={`text-xs font-mono font-bold block uppercase tracking-wider ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Data Augmentation Toggles (Row 1)
              </label>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {(['Rotation', 'Color Jitter', 'Blur'] as const).map((key) => {
                  const isActive = augStates[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleAug(key)}
                      className={`flex flex-col sm:flex-row items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none gap-2 ${
                        isActive
                          ? darkMode
                            ? 'bg-[#111827] border-[#F59E0B]/50 text-slate-100 shadow-sm'
                            : 'bg-amber-100/80 border-[#F59E0B] text-amber-950 font-bold shadow-xs'
                          : darkMode
                          ? 'bg-[#111827]/70 border-[#374151] text-slate-400 hover:border-slate-500'
                          : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-mono font-semibold truncate">{key}</span>
                      {/* Pill Slider Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isActive
                            ? 'bg-[#F59E0B]'
                            : darkMode
                            ? 'bg-[#374151]'
                            : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
                            isActive
                              ? 'translate-x-4 bg-white'
                              : darkMode
                              ? 'translate-x-0 bg-slate-400'
                              : 'translate-x-0 bg-slate-500'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Domain Toggles */}
            <div className={`space-y-2 pt-3 border-t ${darkMode ? 'border-[#374151]' : 'border-slate-200'}`}>
              <label className={`text-xs font-mono font-bold block uppercase tracking-wider ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Domain Alignment Toggles (Row 2)
              </label>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {(['Source Domain', 'Target Domain', 'Clear Water Dataset', 'Turbid Coastal Waters'] as const).map((key) => {
                  const isActive = domainStates[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleDomain(key)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none gap-2 ${
                        isActive
                          ? darkMode
                            ? 'bg-[#111827] border-[#F59E0B]/50 text-slate-100 shadow-sm'
                            : 'bg-amber-100/80 border-[#F59E0B] text-amber-950 font-bold shadow-xs'
                          : darkMode
                          ? 'bg-[#111827]/70 border-[#374151] text-slate-400 hover:border-slate-500'
                          : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-mono font-semibold truncate">{key}</span>
                      {/* Pill Slider Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isActive
                            ? 'bg-[#F59E0B]'
                            : darkMode
                            ? 'bg-[#374151]'
                            : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
                            isActive
                              ? 'translate-x-4 bg-white'
                              : darkMode
                              ? 'translate-x-0 bg-slate-400'
                              : 'translate-x-0 bg-slate-500'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra Info Box */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              darkMode ? 'bg-[#111827] border-[#374151] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-1.5 font-bold font-mono text-[#F59E0B]">
                <Info className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Naval Research Domain Alignment</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-sans ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Synthetic turbidity augmentation and adversarial feature alignment minimize domain shift degradation when testing on unseen murky coastal waters.
              </p>
            </div>
          </div>

          {/* Floating Tag Near Bottom */}
          <div className="pt-2">
            <div className={`p-3 rounded-xl border flex items-center justify-between shadow-lg ${
              darkMode ? 'bg-[#0B1120] border-[#60A5FA]/40' : 'bg-blue-50/90 border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                <span className={`text-xs font-mono font-bold ${darkMode ? 'text-[#60A5FA]' : 'text-blue-900'}`}>
                  ViT Domain Adapt — Turbidity shift correction
                </span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-black rounded border ${
                darkMode
                  ? 'bg-[#60A5FA]/20 text-[#60A5FA] border-[#60A5FA]/40'
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}>
                ENABLED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
