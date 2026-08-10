import React, { useState } from 'react';
import { PageId, BoundingBox, ImageSample } from '../../types';
import { SAMPLE_IMAGES } from '../../data/mockData';
import { BoundingBoxOverlay } from '../BoundingBoxOverlay';
import {
  Upload,
  Sliders,
  Eye,
  FileCode,
  Check,
  RefreshCw,
  Crosshair,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ImageDetectionPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const ImageDetectionPage: React.FC<ImageDetectionPageProps> = ({ onNavigate, darkMode = true }) => {
  const [selectedSample, setSelectedSample] = useState<ImageSample>(SAMPLE_IMAGES[0]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0.75);
  const [activeViewMode, setActiveViewMode] = useState<'boxes' | 'masks' | 'raw' | 'enhanced'>('boxes');
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Filtered boxes based on confidence slider
  const visibleBoxes = selectedSample.boxes.filter((b) => b.confidence >= confidenceFilter);

  // Compute live debris density based on visible items
  const liveDensity = (visibleBoxes.length * 2.56).toFixed(1);

  // Compute Pollution Score
  const totalDetected = visibleBoxes.length;
  const avgConfidence = visibleBoxes.reduce((acc, b) => acc + b.confidence, 0) / (totalDetected || 1);
  const totalEstArea = visibleBoxes.reduce((acc, b) => acc + b.estAreaCm2, 0);
  const frameCoveragePct = Math.min(100, Math.round((totalEstArea / 25000) * 100));

  const categoryWeight = visibleBoxes.reduce((acc, b) => {
    if (b.label === 'Ghost Fishing Net') return acc + 25;
    if (b.label === 'Tire / Rubber') return acc + 20;
    if (b.label === 'Plastic Bottle') return acc + 10;
    if (b.label === 'Plastic Bag / Film') return acc + 12;
    return acc + 8;
  }, 0);

  const calculatedPollutionScore = Math.min(
    100,
    Math.round(totalDetected * 8 + avgConfidence * 20 + frameCoveragePct * 1.5 + categoryWeight)
  );

  const getPriorityBadge = (score: number) => {
    if (score >= 76) return { label: 'CRITICAL', color: 'bg-[#FB7185] text-slate-950 font-black' };
    if (score >= 51) return { label: 'HIGH', color: 'bg-[#FBBF24] text-slate-950 font-black' };
    if (score >= 26) return { label: 'MEDIUM', color: 'bg-[#FCD34D] text-slate-950 font-black' };
    return { label: 'LOW', color: 'bg-[#60A5FA] text-slate-950 font-black' };
  };

  const priority = getPriorityBadge(calculatedPollutionScore);

  const handleSelectSample = (sample: ImageSample) => {
    setSelectedSample(sample);
    setSelectedBoxId(null);
  };

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessingUpload(true);
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTimeout(() => {
        setIsProcessingUpload(false);
        setSelectedSample({
          ...SAMPLE_IMAGES[0],
          id: `custom-upload-${Date.now()}`,
          title: file.name,
          imageUrl: url,
          timestamp: 'Just Now',
        });
      }, 1000);
    }
  };

  const handleCopyGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        location: selectedSample.location,
        waterBody: selectedSample.waterBody,
        depthMeters: selectedSample.depthMeters,
        turbidityFTU: selectedSample.turbidityFTU,
        totalItems: visibleBoxes.length,
        densityPerM2: Number(liveDensity),
        pollutionScore: calculatedPollutionScore,
        cleanupPriority: priority.label,
      },
      features: visibleBoxes.map((box) => ({
        type: 'Feature',
        properties: {
          id: box.id,
          label: box.label,
          confidence: box.confidence,
          riskLevel: box.riskLevel,
          estAreaCm2: box.estAreaCm2,
          estimatedWeightGrams: box.estimatedWeightGrams,
        },
        geometry: {
          type: 'Polygon',
          coordinates: box.polygonPoints
            ? [box.polygonPoints.map(([x, y]) => [x, y])]
            : [[[box.x, box.y], [box.x + box.width, box.y], [box.x + box.width, box.y + box.height], [box.x, box.y + box.height], [box.x, box.y]]],
        },
      })),
    };

    navigator.clipboard.writeText(JSON.stringify(geojson, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FBBF24] border-[#FBBF24]/30' : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              OBJECTIVE 1 & 4
            </span>
            <span className={darkMode ? 'text-slate-300' : 'text-black font-medium'}>Instance Segmentation & Density Pipeline</span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              Demo / Sample Mode
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            Underwater Image Detection & Instance Segmentation
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Bounding box localization, polygon instance mask extraction, debris density, and pollution score calculation.
          </p>
        </div>

        {/* View Mode Switcher Toggles */}
        <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs font-mono ${
          darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveViewMode('boxes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'boxes'
                ? 'bg-[#FBBF24] text-slate-950 shadow-md'
                : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Bounding Boxes
          </button>
          <button
            onClick={() => setActiveViewMode('masks')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'masks'
                ? 'bg-[#FBBF24] text-slate-950 shadow-md'
                : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Instance Masks
          </button>
          <button
            onClick={() => setActiveViewMode('enhanced')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'enhanced'
                ? 'bg-[#FCD34D] text-slate-950 shadow-md'
                : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Enhanced
          </button>
          <button
            onClick={() => setActiveViewMode('raw')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'raw'
                ? 'bg-[#FBBF24] text-slate-950 shadow-md'
                : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Raw
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Canvas Preview, Sample Picker, Sliders */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Image Canvas Card */}
          <div className="relative aspect-video sm:aspect-[16/10] rounded-2xl bg-[#0B132B] border border-[#60A5FA]/30 shadow-2xl overflow-hidden group">
            <img
              src={selectedSample.imageUrl}
              alt={selectedSample.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                activeViewMode === 'enhanced' ? 'contrast-125 saturate-150 brightness-110' : ''
              }`}
            />

            {/* Render Overlay Bounding Boxes / Masks if not in raw mode */}
            {activeViewMode !== 'raw' && (
              <BoundingBoxOverlay
                boxes={selectedSample.boxes}
                confidenceFilter={confidenceFilter}
                selectedBoxId={selectedBoxId}
                onSelectBox={(box) => setSelectedBoxId(box ? box.id : null)}
                showLabels={true}
                showMasks={activeViewMode === 'masks' || activeViewMode === 'boxes'}
              />
            )}

            {/* Ghost Net Rose-Coral (#FB7185) Mask Overlay when Ghost Net is highlighted */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="22,35 68,28 85,62 38,82 18,55"
                fill="rgba(251, 113, 133, 0.35)"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </svg>

            {/* Top Badge: Soft Rose-Coral (#FB7185) Confidence Badge "GHOST_NET: 89% CONF" */}
            <div className="absolute top-4 left-4 bg-[#FB7185] text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              <span>GHOST_NET: 89% CONF</span>
            </div>

            {/* Top Right HUD Badge */}
            <div className="absolute top-4 right-4 bg-[#0B132B]/90 border border-[#60A5FA]/30 px-3 py-1 rounded-lg text-[#FCD34D] text-xs font-mono">
              Depth: {selectedSample.depthMeters}m | Turbidity: <strong className="text-[#FCD34D]">{selectedSample.turbidityFTU} FTU</strong>
            </div>

            {/* Bottom Density & Score Summary Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#0B132B]/95 border border-[#60A5FA]/40 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl text-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#1A233A] text-[#FCD34D] border border-[#FCD34D]/30 font-bold font-mono">
                  {visibleBoxes.length} Items
                </div>
                <div>
                  <div className="font-bold text-[#FCD34D]">Debris Density: {liveDensity} items/m²</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    Coverage: {frameCoveragePct}% • Est Mass: {visibleBoxes.reduce((acc, b) => acc + b.estimatedWeightGrams, 0)}g
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Pollution Score</div>
                  <div className="font-bold text-[#FCD34D] text-sm">{calculatedPollutionScore} / 100</div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${priority.color}`}>
                  {priority.label}
                </span>
              </div>
            </div>
          </div>

          {/* Enhancement & Confidence Controls Panel */}
          <div className={`p-5 rounded-2xl border shadow-md space-y-4 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FBBF24]" />
                <h3 className={`font-bold text-sm font-sans ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>Detection & Enhancement Settings</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Confidence Threshold:</span>
                  <span className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-600'}`}>{(confidenceFilter * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.98"
                  step="0.02"
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                  className={`w-full accent-[#FBBF24] cursor-pointer h-2 rounded-lg ${
                    darkMode ? 'bg-[#0B132B]' : 'bg-slate-200'
                  }`}
                />
                <div className={`flex justify-between text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>30% (High Recall)</span>
                  <span>75% (Balanced)</span>
                  <span>98% (High Precision)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-mono font-semibold block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload Custom Underwater Image</label>
                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed cursor-pointer text-xs font-mono ${
                  darkMode
                    ? 'border-[#60A5FA]/40 hover:border-[#FBBF24] bg-[#0B132B] text-slate-300'
                    : 'border-slate-300 hover:border-amber-500 bg-slate-50 text-slate-700'
                }`}>
                  <Upload className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>{isProcessingUpload ? 'Processing...' : 'Browse Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleMockUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Sample Dataset Picker */}
          <div className={`p-4 rounded-2xl border shadow-md space-y-3 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
              darkMode ? 'text-[#FBBF24]' : 'text-amber-600'
            }`}>
              Or Select Sample Underwater Image
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedSample.id === sample.id
                      ? darkMode
                        ? 'bg-[#0B132B] border-[#FBBF24] ring-1 ring-[#FBBF24]'
                        : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                      : darkMode
                      ? 'bg-[#0B132B] border-[#60A5FA]/20 hover:border-[#60A5FA]/50'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate text-xs">
                    <div className={`font-bold truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{sample.title}</div>
                    <div className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sample.waterBody}</div>
                    <div className={`text-[10px] font-mono font-semibold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>{sample.totalItems} Items Logged</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detection Results List */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-2xl border shadow-md space-y-4 h-full flex flex-col justify-between transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <div className={`flex justify-between items-center pb-3 border-b ${
                darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'
              }`}>
                <h3 className={`text-base font-bold flex items-center gap-2 ${
                  darkMode ? 'text-[#FBBF24]' : 'text-amber-600'
                }`}>
                  <Crosshair className="w-4 h-4 text-[#FBBF24]" />
                  Detected Objects ({visibleBoxes.length})
                </h3>
                <span className={`text-[10px] font-mono font-bold ${
                  darkMode ? 'text-[#FCD34D]' : 'text-amber-700'
                }`}>Select to Highlight</span>
              </div>

              {/* Box Cards List */}
              <div className="space-y-2.5 mt-3 max-h-[520px] overflow-y-auto pr-1">
                {visibleBoxes.length === 0 ? (
                  <div className={`text-center py-12 text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    No items match confidence filter ({(confidenceFilter * 100).toFixed(0)}%). Adjust threshold.
                  </div>
                ) : (
                  visibleBoxes.map((box) => {
                    const isSelected = selectedBoxId === box.id;

                    return (
                      <div
                        key={box.id}
                        onClick={() => setSelectedBoxId(box.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? 'bg-[#0B132B] border-[#FBBF24] ring-1 ring-[#FBBF24] shadow-md'
                              : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                            : darkMode
                            ? 'bg-[#0B132B] border-[#60A5FA]/20 hover:border-[#60A5FA]/50'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold text-xs flex items-center gap-1.5 ${
                            darkMode ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: box.color }} />
                            {box.label}
                          </span>
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                            darkMode
                              ? 'text-[#FCD34D] bg-[#1A233A] border-[#FCD34D]/30'
                              : 'text-amber-800 bg-amber-100 border-amber-300'
                          }`}>
                            {(box.confidence * 100).toFixed(0)}% Conf
                          </span>
                        </div>

                        <div className={`grid grid-cols-2 gap-2 text-[10px] font-mono mt-2 pt-2 border-t ${
                          darkMode ? 'text-slate-300 border-[#60A5FA]/20' : 'text-slate-600 border-slate-200'
                        }`}>
                          <div>Est Area: <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}>{box.estAreaCm2} cm²</strong></div>
                          <div>Est Weight: <strong className={darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}>{box.estimatedWeightGrams} g</strong></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Export Payload Button */}
            <div className={`pt-4 border-t space-y-2 ${darkMode ? 'border-[#60A5FA]/20' : 'border-slate-200'}`}>
              <button
                onClick={handleCopyGeoJSON}
                className="w-full py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer font-mono"
              >
                {copiedPayload ? <Check className="w-4 h-4 text-slate-950" /> : <FileCode className="w-4 h-4 text-slate-950" />}
                <span>{copiedPayload ? 'GeoJSON Copied!' : 'Export GeoJSON Payload'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
