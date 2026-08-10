import React, { useState } from 'react';
import { Sparkles, Sliders, Eye, ArrowRight, Download, RefreshCw, CheckCircle, Info, Image as ImageIcon } from 'lucide-react';
import { ENHANCEMENT_METHODS, SAMPLE_TURBID_IMAGE_URL } from '../../data/mockData';
import { PageId } from '../../types';

interface UnderwaterEnhancementPageProps {
  onNavigate: (page: PageId) => void;
}

export const UnderwaterEnhancementPage: React.FC<UnderwaterEnhancementPageProps> = ({ onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('dehazing');
  const [enhancementStrength, setEnhancementStrength] = useState<number>(75);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const activeMethodObj = ENHANCEMENT_METHODS.find((m) => m.id === selectedMethod) || ENHANCEMENT_METHODS[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const currentImage = uploadedImage || SAMPLE_TURBID_IMAGE_URL;

  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 text-slate-100 font-sans bg-[#0B132B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B132B] text-[#FBBF24] border border-[#FBBF24]/30 font-bold">
              OBJECTIVE 2
            </span>
            <span className="text-slate-300 font-mono">Underwater Image Enhancement Engine</span>
            <span className="px-2 py-0.5 rounded bg-[#0B132B] text-[#FCD34D] border border-[#FCD34D]/30 text-[10px] font-bold">
              Demo / Sample Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FBBF24]">
            Color Correction, Dehazing & Contrast Restoration
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Restores red-wavelength absorption, removes backscatter haze, and boosts contrast in turbid waters before detection.
          </p>
        </div>

        <button
          onClick={() => onNavigate('image-detection')}
          className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer shrink-0"
        >
          <span>Run Detection Pipeline</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Before / After Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#60A5FA]/20 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#FBBF24]" />
                <h3 className="font-bold text-[#FBBF24] text-sm">Interactive Before vs. Enhanced Comparison</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded bg-[#0B132B] border border-[#60A5FA]/20">Raw FTU: 78.4</span>
                <span className="px-2 py-0.5 rounded bg-[#0B132B] text-[#FCD34D] border border-[#FCD34D]/30 font-bold">
                  PSNR Gain: +{activeMethodObj.psnrGainDb} dB
                </span>
              </div>
            </div>

            {/* Split Comparison Image Canvas */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0B132B] border border-[#60A5FA]/30 group select-none">
              {/* After / Enhanced Layer (Bottom) */}
              <img
                src={currentImage}
                alt="Enhanced Underwater"
                className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-150 brightness-110"
              />

              {/* Before / Raw Layer (Top with Clip path) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={currentImage}
                  alt="Raw Turbid Underwater"
                  className="absolute top-0 left-0 max-w-none h-full object-cover filter contrast-75 brightness-75 hue-rotate-15 saturate-50"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B132B]/90 text-white font-mono text-[10px] font-bold backdrop-blur-xs border border-[#60A5FA]/30">
                  RAW TURBID IMAGE
                </div>
              </div>

              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#FBBF24] text-slate-950 font-mono text-[10px] font-black shadow-md">
                ENHANCED (+{activeMethodObj.psnrGainDb} dB)
              </div>

              {/* Slider Handle Divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#FBBF24] cursor-ew-resize shadow-md"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FBBF24] text-slate-950 flex items-center justify-center shadow-lg border border-white font-black text-xs">
                  ↔
                </div>
              </div>

              {/* Range Input Overlay for Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
              />
            </div>

            {/* Slider Instructions */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>← Drag slider to compare raw vs enhanced image</span>
              <span>Slider Position: {sliderPosition}%</span>
            </div>
          </div>

          {/* Quantitative Quality Improvement Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md">
              <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">PSNR GAIN</span>
              <div className="text-xl font-black text-[#FCD34D] mt-0.5">+{activeMethodObj.psnrGainDb} dB</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Peak Signal-to-Noise Boost</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md">
              <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">UIQM SCORE</span>
              <div className="text-xl font-black text-[#FCD34D] mt-0.5">{activeMethodObj.uiqmScore} / 5.0</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Underwater Image Quality</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md">
              <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">CONTRAST GAIN</span>
              <div className="text-xl font-black text-[#FCD34D] mt-0.5">+{Math.round(enhancementStrength * 0.48)}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Benthic Local Contrast</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md">
              <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">HAZE REDUCTION</span>
              <div className="text-xl font-black text-[#FCD34D] mt-0.5">{Math.round(enhancementStrength * 0.88)}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Particulate Backscatter Cleared</p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Enhancement Controls & Method Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-[#60A5FA]/20 pb-3">
              <Sliders className="w-4 h-4 text-[#FBBF24]" />
              <h3 className="font-bold text-[#FBBF24] text-sm">Enhancement Parameters</h3>
            </div>

            {/* Custom Image Upload */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">UPLOAD CUSTOM IMAGE</label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#60A5FA]/40 hover:border-[#FBBF24] bg-[#0B132B] hover:bg-[#0B132B]/80 cursor-pointer transition-colors text-xs text-slate-300 font-medium">
                <ImageIcon className="w-4 h-4 text-[#FBBF24]" />
                <span>Select Underwater Image File</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block font-mono">SELECT ENHANCEMENT ALGORITHM</label>
              <div className="space-y-2">
                {ENHANCEMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedMethod === method.id
                        ? 'border-[#FBBF24] bg-[#0B132B] shadow-md'
                        : 'border-[#60A5FA]/20 bg-[#0B132B]/50 hover:bg-[#0B132B]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-100">
                      <span>{method.name}</span>
                      {selectedMethod === method.id && <CheckCircle className="w-3.5 h-3.5 text-[#FBBF24]" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Strength Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#60A5FA]/20">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-300">Restoration Strength</span>
                <span className="text-[#FCD34D] font-bold">{enhancementStrength}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={enhancementStrength}
                onChange={(e) => setEnhancementStrength(Number(e.target.value))}
                className="w-full accent-[#FBBF24] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0B132B] border border-[#60A5FA]/30 text-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[#FBBF24]">
                <Info className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Research Objective Alignment</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Enhancement algorithms preprocess turbid input frames to improve downstream instance segmentation confidence in low-visibility environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
