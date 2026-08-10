import React from 'react';
import { PageId } from '../../types';
import { HERO_IMAGE_URL } from '../../data/mockData';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  Layers,
  Waves,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 selection:bg-[#FBBF24] selection:text-slate-950 relative">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1A233A] border border-[#60A5FA]/30 text-[#FBBF24] text-xs font-mono mb-6 font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>NIRMALSAGAR — UNDERWATER MARINE DEBRIS DETECTION & ANALYSIS</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FBBF24] font-sans leading-tight">
              NIRMALSAGAR
              <span className="block mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100">
                Marine Environment Computer Vision Pipeline
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
              A computer vision pipeline designed for <strong className="text-[#FBBF24] font-semibold">underwater debris detection, instance segmentation, image enhancement</strong>, and <strong className="text-[#FCD34D] font-semibold">density-based pollution scoring</strong> in turbid marine environments.
            </p>

            {/* Three Action Buttons in Amber-Gold (#FBBF24) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all font-mono cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>OPEN DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => onNavigate('image-detection')}
                className="px-5 py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all font-mono cursor-pointer transform hover:-translate-y-0.5"
              >
                <Eye className="w-4 h-4 text-slate-950" />
                <span>IMAGE DETECTION</span>
              </button>

              <button
                onClick={() => onNavigate('video-detection')}
                className="px-5 py-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all font-mono cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sliders className="w-4 h-4 text-slate-950" />
                <span>VIDEO ANALYSIS</span>
              </button>
            </div>

            {/* Quick Live Numerical Stats Row */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#60A5FA]/20 max-w-2xl font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">DOMAIN ACCURACY</div>
                <div className="text-base font-black text-[#FCD34D] mt-0.5">94.8%</div>
                <div className="text-[10px] text-slate-400">Model Accuracy</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">WATER TURBIDITY</div>
                <div className="text-base font-black text-[#FCD34D] mt-0.5">78.4 FTU</div>
                <div className="text-[10px] text-slate-400">Turbidity Index</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">FPS INFERENCE</div>
                <div className="text-base font-black text-[#FCD34D] mt-0.5">60 FPS</div>
                <div className="text-[10px] text-slate-400">Real-Time ROV</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30">
                <div className="text-[10px] text-slate-400 font-bold uppercase">LITTER COUNT</div>
                <div className="text-base font-black text-[#FCD34D] mt-0.5">142 ITEMS</div>
                <div className="text-[10px] text-slate-400">Active Station</div>
              </div>
            </div>
          </div>

          {/* Right Showcase Card - Central Underwater Image Feed with Ghost Net Segmentation Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl bg-[#1A233A] border border-[#60A5FA]/30 p-2 shadow-2xl overflow-hidden backdrop-blur-md">
              <div className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-[#60A5FA]/30 bg-[#0B132B]">
                <img
                  src={HERO_IMAGE_URL}
                  alt="NirmalSagar Underwater Detection"
                  className="w-full h-full object-cover brightness-90 contrast-105"
                />

                {/* Soft Rose-Coral (#FB7185) Segmentation Mask Polygon Overlay for Ghost Net */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Rose-coral segmentation mask for ghost net */}
                  <polygon
                    points="22,35 68,28 85,62 38,82 18,55"
                    fill="rgba(251, 113, 133, 0.35)"
                    stroke="#FB7185"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  {/* Bounding box around ghost net */}
                  <rect
                    x="16"
                    y="24"
                    width="72"
                    height="62"
                    fill="none"
                    stroke="#FB7185"
                    strokeWidth="2"
                    rx="3"
                  />
                </svg>

                {/* Top Badge: Soft Rose-Coral (#FB7185) Confidence Badge "GHOST_NET: 89% CONF" */}
                <div className="absolute top-3 left-3 bg-[#FB7185] text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  <span>GHOST_NET: 89% CONF</span>
                </div>

                {/* Live Stream Sensor Overlay */}
                <div className="absolute top-3 right-3 bg-[#0B132B]/90 border border-[#60A5FA]/30 px-2.5 py-1 rounded text-[11px] font-mono text-[#FCD34D] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FCD34D] animate-pulse" />
                  <span>ROV FEED #01</span>
                </div>

                {/* Bottom Stats Card overlay */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0B132B]/95 border border-[#60A5FA]/40 p-3 rounded-lg text-xs font-mono space-y-1.5 shadow-xl">
                  <div className="flex justify-between items-center text-[#FBBF24] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#FB7185]" /> Ghost Net Segmentation
                    </span>
                    <span className="text-[#FCD34D] font-mono">89% CONF</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Domain Accuracy: <strong className="text-[#FCD34D]">94.8%</strong></span>
                    <span>Turbidity: <strong className="text-[#FCD34D]">78.4 FTU</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Four Objective Cards with subtle soft-blue (#60A5FA) borders */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#60A5FA]/20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-[#FBBF24] font-sans">
            Core Objectives & Technical Architecture
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            NirmalSagar integrates four specialized deep learning modules designed for degraded underwater environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Objective 1: Detection */}
          <div className="p-5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-3 hover:border-[#FBBF24]/60 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#FBBF24] text-slate-950 flex items-center justify-center font-black font-mono text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-[#FBBF24]">Detection & Instance Masks</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detects, classifies, and segments underwater debris (plastics, ghost nets, metal) using Mask R-CNN & YOLO architectures.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#FCD34D] font-bold">
              Accuracy: 94.8% | Mask IoU: 88.2%
            </div>
          </div>

          {/* Objective 2: Enhancement */}
          <div className="p-5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-3 hover:border-[#FBBF24]/60 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#FBBF24] text-slate-950 flex items-center justify-center font-black font-mono text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-[#FBBF24]">Image Enhancement</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Applies dark channel prior dehazing, attenuation compensation, and contrast stretching for murky underwater visibility.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#FCD34D] font-bold">
              PSNR Gain: +6.4 dB | SSIM: 0.92
            </div>
          </div>

          {/* Objective 3: Domain Adaptation */}
          <div className="p-5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-3 hover:border-[#FBBF24]/60 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#FBBF24] text-slate-950 flex items-center justify-center font-black font-mono text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-[#FBBF24]">Domain Generalization</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maintains zero-shot model accuracy across varying water turbidity levels, depths, and color absorption distributions.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#FCD34D] font-bold">
              Turbidity: 78.4 FTU Calibration
            </div>
          </div>

          {/* Objective 4: Pollution Scoring */}
          <div className="p-5 rounded-xl bg-[#1A233A] border border-[#60A5FA]/30 shadow-md space-y-3 hover:border-[#FBBF24]/60 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#FBBF24] text-slate-950 flex items-center justify-center font-black font-mono text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-[#FBBF24]">Pollution Index Scoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates transparent marine debris density and pollution severity scores from detected surface coverage and item counts.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#FB7185] font-bold">
              Index: Critical High (8.4/10)
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#60A5FA]/20 bg-[#0B132B] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#FBBF24]" />
            <span className="font-bold text-slate-100">NIRMALSAGAR</span>
            <span className="text-[10px] text-slate-400">| Marine Debris Computer Vision Platform</span>
          </div>

          <div className="text-[10px] text-[#FCD34D] font-bold">
            Domain Accuracy: 94.8% | Turbidity: 78.4 FTU
          </div>
        </div>
      </footer>
    </div>
  );
};

