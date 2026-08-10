import React, { useState } from 'react';
import { PageId, ReportDocument } from '../../types';
import { REPORTS } from '../../data/mockData';
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Printer,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate, darkMode = true }) => {
  const [selectedReport, setSelectedReport] = useState<ReportDocument>(REPORTS[0]);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleTriggerDownload = (format: string) => {
    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 2500);
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
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              MINISTRY & RESEARCH POLICY BRIEFINGS
            </span>
            <span className={`text-xs font-mono ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>Verified Environmental Audits</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold mt-1 ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            Automated Environmental Compliance & AI Reports
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Export executive summaries, GeoJSON polygon overlays, and debris density matrices for coastal cleanup planning.
          </p>
        </div>
      </div>

      {/* Grid Layout: Reports List & Interactive Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Report List Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className={`text-xs font-mono uppercase tracking-wider px-1 font-bold ${
            darkMode ? 'text-[#FBBF24]' : 'text-amber-600'
          }`}>
            Available Official Briefings
          </div>
          {REPORTS.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedReport.id === rep.id
                  ? darkMode
                    ? 'bg-[#0B132B] border-[#FBBF24] shadow-md'
                    : 'bg-amber-50 border-amber-400 shadow-sm'
                  : darkMode
                  ? 'bg-[#1A233A] border-[#60A5FA]/30 hover:border-[#60A5FA]'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  darkMode ? 'bg-[#1A233A] text-[#FCD34D] border-[#60A5FA]/20' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {rep.category}
                </span>
                <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{rep.date}</span>
              </div>
              <h4 className={`font-bold text-sm leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{rep.title}</h4>
              <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{rep.summary}</p>
              <div className={`flex justify-between items-center text-[10px] font-mono mt-3 pt-2 border-t ${
                darkMode ? 'text-slate-400 border-[#60A5FA]/20' : 'text-slate-500 border-slate-200'
              }`}>
                <span>{rep.region}</span>
                <span className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>{rep.fileSize}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 8 cols: Interactive Document Viewer */}
        <div className={`lg:col-span-8 p-6 sm:p-8 rounded-2xl border shadow-md space-y-6 transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
          }`}>
            <div>
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                darkMode ? 'text-[#FCD34D]' : 'text-amber-700'
              }`}>{selectedReport.category}</span>
              <h2 className={`text-xl sm:text-2xl font-bold mt-1 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>{selectedReport.title}</h2>
              <div className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Published: {selectedReport.date} | Author: {selectedReport.author}
              </div>
            </div>

            {/* Format Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerDownload('PDF')}
                className="px-3.5 py-2 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => handleTriggerDownload('GeoJSON')}
                className={`px-3 py-2 rounded-xl font-bold text-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-[#0B132B] hover:bg-[#0B132B]/80 text-[#FCD34D] border-[#60A5FA]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-amber-900 border-slate-300'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`} />
                <span>GeoJSON</span>
              </button>
              <button
                onClick={() => handleTriggerDownload('Excel')}
                className={`px-3 py-2 rounded-xl font-bold text-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-[#0B132B] hover:bg-[#0B132B]/80 text-[#FCD34D] border-[#60A5FA]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-amber-900 border-slate-300'
                }`}
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`} />
                <span>CSV / Excel</span>
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-pulse ${
              darkMode ? 'bg-[#0B132B] border-[#FBBF24] text-[#FCD34D]' : 'bg-amber-50 border-amber-400 text-amber-900'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
              <span>Report exported in {downloadSuccess} format successfully!</span>
            </div>
          )}

          {/* Document Content View */}
          <div className={`space-y-4 text-xs sm:text-sm leading-relaxed font-sans ${
            darkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <div className={`p-4 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className={`font-bold text-sm flex items-center gap-2 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
                <Sparkles className="w-4 h-4 text-[#FBBF24]" /> Executive AI Summary & Key Findings
              </h4>
              <p>{selectedReport.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL DEBRIS COUNT</div>
                <div className={`text-xl font-black font-mono mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>
                  {selectedReport.debrisCount.toLocaleString()} Items
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REGION AUDITED</div>
                <div className={`text-sm font-bold mt-1 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{selectedReport.region}</div>
              </div>
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DOMAIN SHIFT ACCURACY</div>
                <div className={`text-xl font-black font-mono mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>94.8% mAP@50</div>
              </div>
            </div>

            <div className={`pt-4 border-t space-y-2 ${darkMode ? 'border-[#60A5FA]/20 text-slate-200' : 'border-slate-200 text-slate-800'}`}>
              <h4 className={`font-bold ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>Recommended Policy Interventions</h4>
              <ul className={`list-disc list-inside space-y-1 text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <li>Deploy ROV-guided diver teams to Visakhapatnam Harbor Sector 04 to untangle 2.2kg ghost fishing net.</li>
                <li>Establish automated turbidity monitoring buoys along Kochi Estuary outflow to catch seasonal monsoon plastics.</li>
                <li>Institute mandatory GPS tagging for commercial fishing trawler nets across Bay of Bengal EEZ.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
