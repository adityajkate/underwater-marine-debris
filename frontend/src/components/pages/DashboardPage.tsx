import React from 'react';
import { PageId } from '../../types';
import { COASTAL_STATIONS, ANALYTICS_SERIES, SAMPLE_IMAGES, HERO_IMAGE_URL } from '../../data/mockData';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Radio,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Eye,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  selectedRegion: string;
  darkMode?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, selectedRegion, darkMode = true }) => {
  return (
    <div className={`p-4 sm:p-6 space-y-5 max-w-[1920px] mx-auto font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Top Banner & Quick Context */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#FCD34D] animate-pulse" />
            <span className={`font-bold uppercase ${darkMode ? 'text-[#FBBF24]' : 'text-amber-800'}`}>COMMAND CENTER ACTIVE</span>
            <span className={darkMode ? 'text-slate-500' : 'text-slate-400'}>|</span>
            <span className={darkMode ? 'text-slate-300' : 'text-black font-medium'}>
              Sector: <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-900'}>{selectedRegion}</strong>
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 font-sans ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            Underwater Debris Monitoring & Operations
          </h1>
          <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Real-time ROV telemetry, turbid-water instance segmentation, and priority recovery matrices across Indian EEZ maritime sectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 font-mono">
          <button
            onClick={() => onNavigate('image-detection')}
            className="px-4 py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-950" />
            <span>IMAGE INFERENCE</span>
          </button>
          <button
            onClick={() => onNavigate('video-detection')}
            className="px-4 py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-slate-950" />
            <span>ROV LIVE FEED</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* KPI 1 */}
        <div className={`p-4 rounded-xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[11px] uppercase tracking-wider font-sans font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Debris Logged</span>
            <div className={`p-1.5 rounded border ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-50 text-[#D97706] border-amber-200'
            }`}>
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>24,850</div>
          <div className={`flex items-center gap-1.5 text-[11px] mt-1 font-sans ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>
            <TrendingUp className="w-3 h-3 text-[#FBBF24]" />
            <span>+14.2% vs last month</span>
            <span className={`text-[10px] ml-auto font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>EEZ WIDE</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-4 rounded-xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[11px] uppercase tracking-wider font-sans font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Domain Accuracy</span>
            <div className={`p-1.5 rounded border ${
              darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-50 text-[#D97706] border-amber-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>94.8%</div>
          <div className={`flex items-center gap-1.5 text-[11px] mt-1 font-sans ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>
            <ShieldCheck className="w-3 h-3 text-[#FBBF24]" />
            <span>ViT Domain-Adapt Active</span>
            <span className={`text-[10px] ml-auto font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>0-120 FTU</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-4 rounded-xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[11px] uppercase tracking-wider font-sans font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Water Turbidity Index</span>
            <div className={`p-1.5 rounded border ${
              darkMode ? 'bg-[#0B132B] text-[#FB7185] border-[#FB7185]/30' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>78.4 FTU</div>
          <div className="flex items-center gap-1.5 text-[11px] mt-1 text-[#FB7185] font-sans">
            <span>High Turbidity Sector</span>
            <span className={`text-[10px] ml-auto font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>&gt;15 items/m²</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`p-4 rounded-xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[11px] uppercase tracking-wider font-sans font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ghost Nets & Plastics Ratio</span>
            <div className={`p-1.5 rounded border ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-50 text-[#D97706] border-amber-200'
            }`}>
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className={`text-2xl font-black ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>82.0%</div>
          <div className={`flex items-center gap-1.5 text-[11px] mt-1 font-sans ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <span className="text-[#FBBF24] font-bold">64% Plastics</span> + <span className="text-[#FB7185] font-bold">18% Ghost Nets</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Temporal Detection Trend (Area Chart) */}
        <div className={`lg:col-span-8 p-4 rounded-xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
                <Activity className="w-4 h-4 text-[#FBBF24]" />
                Monthly Debris Detection & Recovery Trends
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Monsoon river runoff correlation with seafloor debris accumulation in Indian coastal waters.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" /> Logged
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-[#60A5FA]' : 'text-blue-600'}`}>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#60A5FA]" /> Recovered
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_SERIES.monthlyTrend}>
                <defs>
                  <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke={darkMode ? '#253252' : '#E5E7EB'} />
                <XAxis dataKey="month" stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1A233A' : '#FFFFFF',
                    borderColor: darkMode ? '#60A5FA' : '#CBD5E1',
                    borderRadius: '8px',
                    color: darkMode ? '#f1f5f9' : '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="itemsDetected" stroke="#FBBF24" strokeWidth={2.5} fillOpacity={1} fill="url(#colorItems)" name="Items Detected" />
                <Area type="monotone" dataKey="cleanupDone" stroke="#60A5FA" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClean)" name="Cleanup Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Debris Breakdown Donut Chart */}
        <div className={`lg:col-span-4 p-4 rounded-xl border shadow-md flex flex-col justify-between space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
              <PieChart className="w-4 h-4 text-[#FBBF24]" />
              Material Composition Breakdown
            </h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Classification by Swin-B vision transformer.
            </p>
          </div>

          <div className="h-48 w-full my-auto relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ANALYTICS_SERIES.classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="percentage"
                >
                  {ANALYTICS_SERIES.classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FBBF24' : index === 1 ? '#FB7185' : index === 2 ? '#60A5FA' : '#FCD34D'} stroke={darkMode ? '#1A233A' : '#FFFFFF'} strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1A233A' : '#FFFFFF',
                    borderColor: darkMode ? '#60A5FA' : '#CBD5E1',
                    borderRadius: '8px',
                    color: darkMode ? '#f1f5f9' : '#0f172a',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
              <span className={`text-xl font-black ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>64%</span>
              <span className={`text-[10px] uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Plastics Total</span>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            {ANALYTICS_SERIES.classDistribution.slice(0, 4).map((c, i) => (
              <div key={c.name} className={`flex items-center gap-1.5 text-[11px] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: i === 0 ? '#FBBF24' : i === 1 ? '#FB7185' : i === 2 ? '#60A5FA' : '#FCD34D' }} />
                <span className="truncate">{c.name}</span>
                <span className={`font-bold ml-auto ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Active Coastal Stations Table & Recent Live Scan Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Modern Coastal Stations Table */}
        <div className={`lg:col-span-7 p-4 rounded-xl border shadow-md space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
                <MapPin className="w-4 h-4 text-[#FBBF24]" />
                Active Coastal Monitoring Stations
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Live turbidity index (FTU) and debris density score (0-100).
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className={`text-xs font-mono font-bold flex items-center gap-1 cursor-pointer ${
                darkMode ? 'text-[#FBBF24] hover:text-[#F59E0B]' : 'text-amber-600 hover:text-amber-700'
              }`}
            >
              <span>MAP VIEW</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className={`border-b font-mono text-[10px] uppercase tracking-wider ${
                  darkMode ? 'border-[#60A5FA]/20 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="py-2 px-2">Station Name</th>
                  <th className="py-2 px-2">Turbidity (FTU)</th>
                  <th className="py-2 px-2">Density Index</th>
                  <th className="py-2 px-2">Dominant Pollutant</th>
                  <th className="py-2 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                darkMode ? 'divide-[#60A5FA]/10 text-slate-200' : 'divide-slate-200 text-slate-800'
              }`}>
                {COASTAL_STATIONS.map((station) => (
                  <tr key={station.id} className={`transition-colors ${
                    darkMode ? 'hover:bg-[#253252]' : 'hover:bg-slate-50'
                  }`}>
                    <td className="py-2.5 px-2 font-medium">
                      <div className={darkMode ? 'text-slate-100' : 'text-slate-900'}>{station.name}</div>
                      <div className={`text-[10px] font-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{station.region}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {station.turbidityAvg} FTU
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-1.5 rounded overflow-hidden border ${
                          darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-200 border-slate-300'
                        }`}>
                          <div
                            className={`h-full ${
                              station.debrisDensityScore > 75 ? 'bg-[#FB7185]' : station.debrisDensityScore > 40 ? 'bg-[#FBBF24]' : 'bg-[#60A5FA]'
                            }`}
                            style={{ width: `${station.debrisDensityScore}%` }}
                          />
                        </div>
                        <span className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>{station.debrisDensityScore}</span>
                      </div>
                    </td>
                    <td className={`py-2.5 px-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{station.dominantPollutant}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-[11px]">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-bold ${
                        darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/40' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
                        {station.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 cols: Latest Image Scan & Bounding Box Card with Ghost Net Mask */}
        <div className={`lg:col-span-5 p-4 rounded-xl border shadow-md flex flex-col justify-between space-y-3 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-1 font-mono">
              <h3 className={`text-sm font-bold flex items-center gap-2 font-sans ${
                darkMode ? 'text-[#FBBF24]' : 'text-amber-600'
              }`}>
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                Latest Autonomous ROV Scan
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                darkMode ? 'text-[#FCD34D] bg-[#0B132B] border-[#FCD34D]/30' : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}>
                12 mins ago
              </span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {SAMPLE_IMAGES[0].title} — Depth {SAMPLE_IMAGES[0].depthMeters}m, Turbidity <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>78.4 FTU</strong>
            </p>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#60A5FA]/30 group bg-[#0B132B]">
            <img
              src={SAMPLE_IMAGES[0].imageUrl}
              alt="Scan Event"
              className="w-full h-full object-cover brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-80" />

            {/* Ghost Net Rose-Coral (#FB7185) Mask Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="20,25 75,20 88,70 30,85"
                fill="rgba(251, 113, 133, 0.35)"
                stroke="#FB7185"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Ghost Net Confidence Badge */}
            <div className="absolute top-2 left-2 bg-[#FB7185] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 font-mono">
              <span>GHOST_NET: 89% CONF</span>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs font-mono">
              <span className="text-[#FCD34D] font-bold">Domain Accuracy: 94.8%</span>
              <span className="text-[#FB7185] font-black">{SAMPLE_IMAGES[0].cleanupPriority}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('image-detection')}
            className="w-full py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span>OPEN INFERENCE WORKSPACE</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
