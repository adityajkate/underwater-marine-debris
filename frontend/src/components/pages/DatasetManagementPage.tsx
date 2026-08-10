import React, { useState } from 'react';
import { PageId, DatasetItem } from '../../types';
import { DATASET_ITEMS } from '../../data/mockData';
import {
  Database,
  Search,
  Filter,
  Upload,
  Layers,
  Sparkles,
  Tag,
  Plus,
  RefreshCw,
  FileCode2,
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';

interface DatasetManagementPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const DatasetManagementPage: React.FC<DatasetManagementPageProps> = ({ onNavigate, darkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [useBackend, setUseBackend] = useState<boolean>(false);

  const filteredItems = DATASET_ITEMS.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCond = selectedCondition === 'All' || item.waterConditions === selectedCondition;
    return matchesSearch && matchesCond;
  });

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-5 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-slate-900'
    }`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-2 py-0.5 rounded border font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              COMPUTER VISION DATASET
            </span>
            <span className={darkMode ? 'text-slate-400' : 'text-slate-400'}>|</span>
            <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>NirmalSagar Underwater Marine Debris Corpus</span>
            {!useBackend && (
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${
                darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                Sample Metadata
              </span>
            )}
          </div>
          <h1 className={`text-2xl font-bold tracking-tight mt-1 ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>
            Computer Vision Dataset & Annotation Metrics
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Structured computer vision dataset specifications for instance segmentation (Mask R-CNN / YOLO-Seg).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setUseBackend(!useBackend)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              useBackend
                ? 'bg-[#FBBF24] text-slate-950 border-[#FBBF24]'
                : darkMode
                ? 'bg-[#0B132B] text-slate-200 border-[#60A5FA]/30 hover:border-[#60A5FA]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400'
            }`}
          >
            {useBackend ? 'Backend Stream: Connected' : 'Toggle Live Backend State'}
          </button>
        </div>
      </div>

      {/* Primary Dataset Specifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-sans uppercase font-medium ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>TOTAL IMAGES</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>
            {useBackend ? '--' : '4,820'}
          </div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Resolution: 3840×2160 & 1920×1080</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-sans uppercase font-medium ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>TOTAL ANNOTATIONS</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>
            {useBackend ? '--' : '18,450'}
          </div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Format: COCO Instance Segmentation</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-sans uppercase font-medium ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>DEBRIS CLASSES</span>
          <div className={`text-2xl font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>
            {useBackend ? '--' : '7 Classes'}
          </div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Plastics, Nets, Metals, Rubber, Glass</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md transition-colors ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-[11px] font-sans uppercase font-medium ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>TRAIN / VAL / TEST SPLIT</span>
          <div className={`text-lg font-black mt-1 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>
            {useBackend ? '-- / -- / --' : '70% / 15% / 15%'}
          </div>
          <p className={`text-[10px] mt-0.5 font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>3,374 / 723 / 723 Images</p>
        </div>
      </div>

      {/* Dataset Condition Breakdown */}
      <div className={`p-5 rounded-2xl border shadow-md space-y-4 transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#FBBF24]" />
            <h3 className={`font-bold text-sm ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>Dataset Condition & Class Distribution</h3>
          </div>
          <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Turbidity & Environment Metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className={`font-bold font-sans ${darkMode ? 'text-[#FBBF24]' : 'text-amber-700'}`}>Water Conditions</span>
            <ul className="space-y-1 pt-1">
              <li className="flex justify-between"><span>Highly Turbid (Murky):</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>42%</strong></li>
              <li className="flex justify-between"><span>Low-Light Deep Bed:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>28%</strong></li>
              <li className="flex justify-between"><span>Coral Reef Clear:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>18%</strong></li>
              <li className="flex justify-between"><span>Estuarine Silt:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>12%</strong></li>
            </ul>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className={`font-bold font-sans ${darkMode ? 'text-[#FBBF24]' : 'text-amber-700'}`}>Annotation Polygon Types</span>
            <ul className="space-y-1 pt-1">
              <li className="flex justify-between"><span>Instance Mask Polygons:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>14,200</strong></li>
              <li className="flex justify-between"><span>Bounding Box Rectangles:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>18,450</strong></li>
              <li className="flex justify-between"><span>Keypoint Markers:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>4,100</strong></li>
            </ul>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className={`font-bold font-sans ${darkMode ? 'text-[#FBBF24]' : 'text-amber-700'}`}>Annotation Standard</span>
            <ul className="space-y-1 pt-1">
              <li className="flex justify-between"><span>Format:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>COCO JSON 1.0</strong></li>
              <li className="flex justify-between"><span>Polygon Points:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>8 to 32 vertices</strong></li>
              <li className="flex justify-between"><span>Turbidity Index:</span> <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}>0.0 - 120.0 FTU</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sample dataset files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none font-mono transition-colors border ${
              darkMode
                ? 'bg-[#0B132B] border-[#60A5FA]/30 text-slate-100 placeholder-slate-400 focus:border-[#FBBF24]'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className={`flex items-center gap-1 text-[11px] shrink-0 font-sans font-medium ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <Filter className="w-3.5 h-3.5 text-[#FBBF24]" /> Condition:
          </span>
          {['All', 'Highly Turbid (Murky)', 'Low-Light Deep Bed', 'Coral Reef Light', 'Estuarine Silt'].map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                selectedCondition === cond
                  ? 'bg-[#FBBF24] text-slate-950 font-black'
                  : darkMode
                  ? 'bg-[#0B132B] text-slate-300 hover:text-white border border-[#60A5FA]/20'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300'
              }`}
            >
              {cond.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Items Grid */}
      {useBackend ? (
        <div className={`p-12 text-center rounded-2xl border space-y-2 ${
          darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200'
        }`}>
          <Database className="w-8 h-8 text-[#FBBF24] mx-auto" />
          <h3 className={`font-bold text-sm ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>Awaiting Backend Dataset Connection</h3>
          <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Connect backend API endpoint to populate live dataset catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border shadow-md flex flex-col justify-between space-y-3 group hover:border-[#FBBF24] transition-all ${
                darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className={`relative aspect-video rounded-xl overflow-hidden border ${
                darkMode ? 'border-[#60A5FA]/30 bg-[#0B132B]' : 'border-slate-200 bg-slate-100'
              }`}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#0B132B]/90 text-[#FCD34D] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#60A5FA]/30 font-bold shadow-xs">
                  {item.turbidityFTU} FTU
                </span>
                <span className="absolute bottom-2 right-2 bg-[#0B132B]/90 text-[#FB7185] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#60A5FA]/30 font-bold shadow-xs">
                  {item.annotationsCount} Polygons
                </span>
              </div>

              <div>
                <div className={`font-bold text-xs truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{item.filename}</div>
                <div className={`text-[11px] font-mono mt-0.5 font-medium ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>{item.source}</div>
                <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Resolution: {item.resolution}</div>
              </div>

              <div className={`flex flex-wrap gap-1 pt-2 border-t font-mono ${
                darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
              }`}>
                {item.classesPresent.map((cls) => (
                  <span key={cls} className={`text-[9px] px-1.5 py-0.5 rounded border ${
                    darkMode ? 'bg-[#0B132B] text-slate-300 border-[#60A5FA]/20' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
