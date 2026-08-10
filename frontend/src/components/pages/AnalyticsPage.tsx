import React, { useState } from 'react';
import { PageId } from '../../types';
import { COASTAL_STATIONS, ANALYTICS_SERIES } from '../../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  MapPin,
  Sparkles,
  Award,
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  Info
} from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate, darkMode = true }) => {
  const [selectedStation, setSelectedStation] = useState(COASTAL_STATIONS[0]);

  // Comparative metrics before and after enhancement
  const enhancementImpactData = [
    { category: 'Plastic Bottle', rawMap: 72, enhancedMap: 94 },
    { category: 'Ghost Net', rawMap: 58, enhancedMap: 88 },
    { category: 'Plastic Bag', rawMap: 61, enhancedMap: 89 },
    { category: 'Metal Can', rawMap: 79, enhancedMap: 96 },
    { category: 'Rubber Tire', rawMap: 81, enhancedMap: 95 },
  ];

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-5 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Top Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              RESEARCH BENCHMARKS
            </span>
            <span className={darkMode ? 'text-slate-300' : 'text-black font-medium'}>Objectives 1, 2, 3 & 4 Performance Metrics</span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              Sample Benchmark Results
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            Model Performance & Experimental Analytics
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Quantitative evaluation across image enhancement preprocessing, instance segmentation accuracy, domain adaptation under turbidity, and spatial density scoring.
          </p>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-bold font-sans uppercase ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>mAP@50 SCORE</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>94.8%</div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>+16.2% improvement after enhancement</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-bold font-sans uppercase ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>MASK IoU (SEGMENTATION)</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>81.2%</div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Polygon instance overlap metric</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-bold font-sans uppercase ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>PRECISION / RECALL</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>92.4% / 89.1%</div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tested on test split (723 images)</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-bold font-sans uppercase ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>TURBIDITY RESILIENCE</span>
          <div className="text-2xl font-black text-[#FB7185] mt-1">0 to 120 FTU</div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Stable detection in murky water</p>
        </div>
      </div>

      {/* Row 1: Objective 2 Impact (Enhancement Impact) & Objective 3 Impact (Domain Generalization) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Objective 2: Baseline vs Enhanced Detection Impact */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex justify-between items-center pb-2 border-b ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                Objective 2 Impact: Downstream mAP vs Image Enhancement
              </h3>
              <p className={`text-[11px] ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Comparing detection mAP on Raw Murky frames vs Color Corrected + Dehazed frames.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enhancementImpactData}>
                <CartesianGrid strokeDasharray="2 2" stroke={darkMode ? '#253252' : '#E5E7EB'} />
                <XAxis dataKey="category" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} unit="%" />
                <RechartsTooltip cursor={false} contentStyle={{
                  backgroundColor: darkMode ? '#0B132B' : '#FFFFFF',
                  borderColor: darkMode ? '#60A5FA' : '#CBD5E1',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: darkMode ? '#FCD34D' : '#1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} />
                <Bar dataKey="rawMap" fill="#60A5FA" name="Raw Murky (mAP %)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enhancedMap" fill="#FBBF24" name="Enhanced (mAP %)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objective 3: Domain Generalization Benchmark vs Water Turbidity */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex justify-between items-center pb-2 border-b ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
                <Award className="w-4 h-4 text-[#FBBF24]" />
                Objective 3 Impact: Accuracy Decay across Water Turbidity (FTU)
              </h3>
              <p className={`text-[11px] ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Comparing standard baseline vs Adversarial Domain-Adapted architecture under increasing turbidity.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_SERIES.domainShiftComparison}>
                <CartesianGrid strokeDasharray="2 2" stroke={darkMode ? '#253252' : '#E5E7EB'} />
                <XAxis dataKey="turbidity" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} unit="%" />
                <RechartsTooltip cursor={false} contentStyle={{
                  backgroundColor: darkMode ? '#0B132B' : '#FFFFFF',
                  borderColor: darkMode ? '#60A5FA' : '#CBD5E1',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: darkMode ? '#FCD34D' : '#1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} />
                <Line type="monotone" dataKey="nirmalSagarViT" stroke="#FBBF24" strokeWidth={2.5} name="Domain Adapted (%)" />
                <Line type="monotone" dataKey="standardYOLO" stroke="#60A5FA" strokeWidth={1.5} strokeDasharray="4 4" name="Baseline (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Objective 1 & 4 - Spatial Coastal Stations & Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Spatial Coastal Stations List */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 pb-2 border-b ${
            darkMode ? 'text-[#FBBF24] border-[#60A5FA]/20' : 'text-amber-600 border-slate-200'
          }`}>
            <MapPin className="w-4 h-4 text-[#FBBF24]" />
            Objective 4: Coastal Station Pollution Index & Debris Density
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COASTAL_STATIONS.map((station) => (
              <div
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  selectedStation.id === station.id
                    ? darkMode
                      ? 'bg-[#0B132B] border-[#FBBF24] ring-1 ring-[#FBBF24] shadow-md'
                      : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                    : darkMode
                    ? 'bg-[#0B132B] border-[#60A5FA]/20 hover:border-[#60A5FA]/50'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{station.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                    station.debrisDensityScore > 75 ? 'bg-[#FB7185] text-slate-950' : 'bg-[#FBBF24] text-slate-950'
                  }`}>
                    Score: {station.debrisDensityScore}/100
                  </span>
                </div>
                <div className={`text-[10px] font-mono mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{station.region}</div>
                <div className={`flex justify-between text-[10px] font-mono pt-2 border-t ${
                  darkMode ? 'text-slate-300 border-[#60A5FA]/20' : 'text-slate-600 border-slate-200'
                }`}>
                  <span>Dominant: <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}>{station.dominantPollutant}</strong></span>
                  <span>Turbidity: <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}>{station.turbidityAvg} FTU</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Breakdown */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 pb-2 border-b ${
            darkMode ? 'text-[#FBBF24] border-[#60A5FA]/20' : 'text-amber-600 border-slate-200'
          }`}>
            <BarChart3 className="w-4 h-4 text-[#FBBF24]" />
            Objective 1: Debris Class Distribution
          </h3>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_SERIES.classDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="2 2" stroke={darkMode ? '#253252' : '#E5E7EB'} />
                <XAxis type="number" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 10 }} width={110} />
                <RechartsTooltip cursor={false} contentStyle={{
                  backgroundColor: darkMode ? '#0B132B' : '#FFFFFF',
                  borderColor: darkMode ? '#60A5FA' : '#CBD5E1',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: darkMode ? '#FCD34D' : '#1E293B',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }} />
                <Bar dataKey="count" fill="#FBBF24" radius={[0, 4, 4, 0]}>
                  {ANALYTICS_SERIES.classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
