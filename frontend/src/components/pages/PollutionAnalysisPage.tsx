import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, BarChart3, Calculator, MapPin, CheckCircle, ArrowRight, Info, Layers } from 'lucide-react';
import { SAMPLE_IMAGES, COASTAL_STATIONS } from '../../data/mockData';
import { PageId, TrashCategory } from '../../types';

interface PollutionAnalysisPageProps {
  onNavigate: (page: PageId) => void;
}

export const PollutionAnalysisPage: React.FC<PollutionAnalysisPageProps> = ({ onNavigate }) => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_IMAGES[0]);

  // Documented formula calculation
  const totalDetected = selectedSample.boxes.length;
  const avgConfidence = selectedSample.boxes.reduce((acc, b) => acc + b.confidence, 0) / (totalDetected || 1);
  const totalEstArea = selectedSample.boxes.reduce((acc, b) => acc + b.estAreaCm2, 0);
  const frameCoveragePct = Math.min(100, Math.round((totalEstArea / 25000) * 100)); // normalized area coverage %

  // Category weight calculation (Ghost nets & Tires weighted higher)
  const categoryWeight = selectedSample.boxes.reduce((acc, b) => {
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
    if (score >= 76) return { label: 'CRITICAL', color: 'bg-[#FB7185] text-slate-950 border-[#FB7185]' };
    if (score >= 51) return { label: 'HIGH', color: 'bg-[#FBBF24] text-slate-950 border-[#FBBF24]' };
    if (score >= 26) return { label: 'MEDIUM', color: 'bg-[#FCD34D] text-slate-950 border-[#FCD34D]' };
    return { label: 'LOW', color: 'bg-emerald-400 text-slate-950 border-emerald-400' };
  };

  const currentPriority = getPriorityBadge(calculatedPollutionScore);

  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 text-slate-100 font-sans bg-[#0B132B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B132B] text-[#FBBF24] border border-[#FBBF24]/30 font-bold">
              OBJECTIVE 4
            </span>
            <span className="text-slate-300 font-mono">Debris Density & Pollution Scoring Engine</span>
            <span className="px-2 py-0.5 rounded bg-[#0B132B] text-[#FCD34D] border border-[#FCD34D]/30 text-[10px] font-bold">
              Demo / Sample Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FBBF24]">
            Seafloor Pollution Prioritization & Scoring
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Calculates reproducible pollution severity scores based on object counts, area coverage, detection confidence, and hazard category weights.
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer shrink-0"
        >
          <span>Generate Priority Report</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* Top Cards: Documented Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-1">
          <span className="text-xs font-mono font-bold text-slate-300">CALCULATED POLLUTION SCORE</span>
          <div className="text-3xl font-black text-[#FCD34D] flex items-baseline gap-2">
            <span>{calculatedPollutionScore}</span>
            <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Based on {totalDetected} detected items</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-1">
          <span className="text-xs font-mono font-bold text-slate-300">CLEANUP PRIORITY</span>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${currentPriority.color}`}>
              {currentPriority.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Action threshold trigger</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-1">
          <span className="text-xs font-mono font-bold text-slate-300">ESTIMATED COVERAGE</span>
          <div className="text-3xl font-black text-[#FCD34D]">{frameCoveragePct}%</div>
          <p className="text-[11px] text-slate-400">Seafloor frame surface area</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-1">
          <span className="text-xs font-mono font-bold text-slate-300">CRITICAL HAZARDS</span>
          <div className="text-3xl font-black text-[#FB7185]">
            {selectedSample.boxes.filter((b) => b.label === 'Ghost Fishing Net' || b.riskLevel === 'Critical').length}
          </div>
          <p className="text-[11px] text-slate-400">Ghost nets & high-risk entanglements</p>
        </div>
      </div>

      {/* Main Breakdown & Methodology Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Selected Image Analysis & Factor Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#60A5FA]/20 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#FBBF24]" />
                <h3 className="font-bold text-[#FBBF24] text-sm">Sample Selection & Score Inputs</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Select Image Sample to Evaluate</span>
            </div>

            {/* Sample Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedSample(img)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSample.id === img.id
                      ? 'border-[#FBBF24] bg-[#0B132B] shadow-md'
                      : 'border-[#60A5FA]/20 bg-[#0B132B]/50 hover:bg-[#0B132B]'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-100 truncate">{img.title}</div>
                  <div className="text-[10px] text-[#FCD34D] font-mono mt-0.5">{img.waterBody} • {img.totalItems} items</div>
                </button>
              ))}
            </div>

            {/* Factor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0B132B] font-mono text-slate-300 border-b border-[#60A5FA]/20">
                  <tr>
                    <th className="p-2.5">FACTOR</th>
                    <th className="p-2.5">MEASURED VALUE</th>
                    <th className="p-2.5">WEIGHT FACTOR</th>
                    <th className="p-2.5 text-right">SCORE CONTRIBUTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#60A5FA]/10 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-200">Detected Object Count</td>
                    <td className="p-2.5 text-slate-300">{totalDetected} items</td>
                    <td className="p-2.5 text-slate-400">× 8.0</td>
                    <td className="p-2.5 text-right font-black text-[#FCD34D]">+{totalDetected * 8} pts</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-200">Average Confidence</td>
                    <td className="p-2.5 text-slate-300">{(avgConfidence * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-slate-400">× 20.0</td>
                    <td className="p-2.5 text-right font-black text-[#FCD34D]">+{Math.round(avgConfidence * 20)} pts</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-200">Seafloor Coverage</td>
                    <td className="p-2.5 text-slate-300">{frameCoveragePct}% surface area</td>
                    <td className="p-2.5 text-slate-400">× 1.5</td>
                    <td className="p-2.5 text-right font-black text-[#FCD34D]">+{Math.round(frameCoveragePct * 1.5)} pts</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-200">Category Hazard Weight</td>
                    <td className="p-2.5 text-slate-300">{selectedSample.boxes.map((b) => b.label).join(', ')}</td>
                    <td className="p-2.5 text-slate-400">Hazard Scale</td>
                    <td className="p-2.5 text-right font-black text-[#FCD34D]">+{categoryWeight} pts</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Formula Callout */}
            <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#60A5FA]/30 text-xs font-mono space-y-1">
              <span className="font-bold text-[#FBBF24]">DOCUMENTED SCORE METHODOLOGY:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Score = min(100, round( Count × 8.0 + AvgConfidence × 20.0 + Coverage% × 1.5 + CategoryWeight ))
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Station Prioritization Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#60A5FA]/20 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FBBF24]" />
                <h3 className="font-bold text-[#FBBF24] text-sm">Coastal Cleanup Priority Queue</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B132B] text-slate-300 border border-[#60A5FA]/20">
                Ranked by Density
              </span>
            </div>

            <div className="space-y-3">
              {COASTAL_STATIONS.map((station, index) => {
                const priority = getPriorityBadge(station.debrisDensityScore);
                return (
                  <div
                    key={station.id}
                    className="p-3.5 rounded-xl border border-[#60A5FA]/20 bg-[#0B132B] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#1A233A] text-[#FBBF24] border border-[#FBBF24]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-xs">{station.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{station.region} • Dominant: {station.dominantPollutant}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${priority.color}`}>
                        {priority.label} ({station.debrisDensityScore})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-[#0B132B] border border-[#60A5FA]/30 text-xs text-slate-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-300">
                Prioritisation queues enable coastal management teams to direct cleanup operations to high-density zones with maximum environmental hazard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
