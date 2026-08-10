import React, { useState, useEffect, useRef } from 'react';
import { PageId, VideoKeyframe } from '../../types';
import { VIDEO_KEYFRAMES, HERO_IMAGE_URL, SAMPLE_TURBID_IMAGE_URL } from '../../data/mockData';
import { BoundingBoxOverlay } from '../BoundingBoxOverlay';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  Activity,
  Sliders,
  Maximize2,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  Upload,
  FileVideo,
  CheckCircle2,
  X,
  Film,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';

interface VideoDetectionPageProps {
  onNavigate: (page: PageId) => void;
  darkMode?: boolean;
}

export const VideoDetectionPage: React.FC<VideoDetectionPageProps> = ({ onNavigate, darkMode = true }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Upload State
  const [uploadedVideo, setUploadedVideo] = useState<{
    name: string;
    size: string;
    url: string | null;
    isCustom: boolean;
  } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeKeyframe: VideoKeyframe = VIDEO_KEYFRAMES[currentFrameIndex];

  // Auto playback interval simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % VIDEO_KEYFRAMES.length);
    }, 3000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (.mp4, .webm, .mov, .avi)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const videoUrl = URL.createObjectURL(file);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    // Simulate analysis progress
    let progress = 0;
    const timer = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setIsUploading(false);
        setUploadedVideo({
          name: file.name,
          size: fileSizeMB,
          url: videoUrl,
          isCustom: true,
        });
        setIsPlaying(true);
      }
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPresetVideo = (title: string, url: string, size: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setIsUploading(false);
        setUploadedVideo({
          name: title,
          size,
          url,
          isCustom: false,
        });
        setIsPlaying(true);
      }
    }, 200);
  };

  const handleClearUploadedVideo = () => {
    if (uploadedVideo?.url && uploadedVideo.isCustom) {
      URL.revokeObjectURL(uploadedVideo.url);
    }
    setUploadedVideo(null);
  };

  return (
    <div className={`p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6 font-sans min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F3F4F6] text-black'
    }`}>
      {/* Top Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-xl backdrop-blur-md transition-colors ${
        darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-bold ${
              darkMode ? 'bg-[#0B132B] text-[#FCD34D] border-[#FCD34D]/30' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              <Radio className={`w-3 h-3 animate-pulse ${darkMode ? 'text-[#FCD34D]' : 'text-amber-800'}`} />
              ROV STREAM: ACTIVE 60 FPS
            </span>
            <span className={`text-xs font-mono ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>Visakhapatnam Deep Harbor Trench</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold mt-1 ${darkMode ? 'text-[#FBBF24]' : 'text-black'}`}>
            Real-Time ROV Video Stream & Keyframe Tracking
          </h1>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-black font-medium'}`}>
            Frame-by-frame object permanence tracking across turbid underwater camera feeds with zero frame drop.
          </p>
        </div>

        {/* Inference Stats Pill */}
        <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border text-xs font-mono ${
          darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-100 border-slate-300'
        }`}>
          <div>
            <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FPS</div>
            <div className={`font-black font-mono ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>60.0 FPS</div>
          </div>
          <div className={`h-6 w-px ${darkMode ? 'bg-[#60A5FA]/20' : 'bg-slate-300'}`} />
          <div>
            <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LATENCY</div>
            <div className={`font-black font-mono ${darkMode ? 'text-[#FBBF24]' : 'text-amber-600'}`}>12.4 ms</div>
          </div>
          <div className={`h-6 w-px ${darkMode ? 'bg-[#60A5FA]/20' : 'bg-slate-300'}`} />
          <div>
            <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>TURBIDITY</div>
            <div className={`font-black font-mono ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>78.4 FTU</div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Large Video Player & Scrubbing Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-2xl bg-[#0B132B] border border-[#60A5FA]/30 shadow-2xl overflow-hidden group">
            <img
              src={currentFrameIndex % 2 === 0 ? HERO_IMAGE_URL : SAMPLE_TURBID_IMAGE_URL}
              alt="ROV Video Stream"
              className="w-full h-full object-cover brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />

            {/* Bounding Box Tracking Overlay */}
            <BoundingBoxOverlay
              boxes={activeKeyframe.boxes}
              confidenceFilter={0.70}
              selectedBoxId={selectedBoxId}
              onSelectBox={(box) => setSelectedBoxId(box ? box.id : null)}
              showLabels={true}
              showMasks={true}
            />

            {/* Ghost Net Rose-Coral (#FB7185) Mask Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="22,35 68,28 85,62 38,82 18,55"
                fill="rgba(251, 113, 133, 0.35)"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </svg>

            {/* Ghost Net Confidence Badge */}
            <div className="absolute top-4 left-4 bg-[#FB7185] text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              <span>GHOST_NET: 89% CONF</span>
            </div>

            {/* Live Video HUD Controls Overlay */}
            <div className="absolute top-4 right-4 bg-[#0B132B]/90 border border-[#60A5FA]/30 px-3 py-1 rounded-lg text-[#FCD34D] text-xs font-mono">
              Depth: 28.2m | Turbidity: <strong className="text-[#FCD34D]">78.4 FTU</strong>
            </div>
          </div>

          {/* Video Player Controls Bar */}
          <div className={`p-4 rounded-2xl border shadow-md space-y-3 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black shadow-md transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950" />}
                </button>
                <button
                  onClick={() => setCurrentFrameIndex((prev) => (prev - 1 + VIDEO_KEYFRAMES.length) % VIDEO_KEYFRAMES.length)}
                  className={`p-2.5 rounded-lg transition-colors border cursor-pointer ${
                    darkMode
                      ? 'bg-[#0B132B] hover:bg-[#253252] text-slate-100 border-[#60A5FA]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentFrameIndex((prev) => (prev + 1) % VIDEO_KEYFRAMES.length)}
                  className={`p-2.5 rounded-lg transition-colors border cursor-pointer ${
                    darkMode
                      ? 'bg-[#0B132B] hover:bg-[#253252] text-slate-100 border-[#60A5FA]/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Timestamp & Frame Counter */}
              <div className={`font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>
                Keyframe {currentFrameIndex + 1} / {VIDEO_KEYFRAMES.length} ({activeKeyframe.timestampFormatted})
              </div>

              {/* Speed Buttons */}
              <div className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/30' : 'bg-slate-100 border-slate-300'
              }`}>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      playbackSpeed === s
                        ? 'bg-[#FBBF24] text-slate-950 shadow-sm'
                        : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Keyframe Timeline scrubber bar */}
            <div className="space-y-1">
              <div className={`flex justify-between text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>00:00</span>
                <span>00:05</span>
                <span>00:10 (Peak Debris)</span>
                <span>00:15</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {VIDEO_KEYFRAMES.map((kf, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentFrameIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-3.5 rounded-md transition-all cursor-pointer ${
                      currentFrameIndex === idx
                        ? 'bg-[#FBBF24] ring-2 ring-[#FCD34D] shadow-sm'
                        : kf.debrisCount >= 5
                        ? 'bg-[#FB7185] hover:bg-[#F43F5E]'
                        : darkMode
                        ? 'bg-[#0B132B] border border-[#60A5FA]/20 hover:border-[#60A5FA]/50'
                        : 'bg-slate-100 border border-slate-300 hover:border-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Upload Under Video Section */}
          <div className={`p-5 rounded-2xl border shadow-md space-y-4 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#FBBF24]/20 text-[#FBBF24]">
                  <Upload className="w-5 h-5 text-[#FBBF24]" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-black'}`}>
                    Upload Custom ROV Video Stream
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Import raw underwater video footage (.mp4, .webm, .mov) for automated frame-by-frame debris segmentation.
                  </p>
                </div>
              </div>
              {uploadedVideo && (
                <button
                  onClick={handleClearUploadedVideo}
                  className={`text-xs font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                    darkMode ? 'bg-[#0B132B] text-slate-300 border-[#60A5FA]/30 hover:text-white' : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Stream
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {/* Upload Area / Active Video Status */}
            {isUploading ? (
              <div className={`p-6 rounded-xl border border-dashed text-center space-y-3 ${
                darkMode ? 'bg-[#0B132B] border-[#FBBF24]/50' : 'bg-amber-50/50 border-amber-300'
              }`}>
                <div className="flex justify-center">
                  <Film className="w-8 h-8 text-[#FBBF24] animate-bounce" />
                </div>
                <div className="space-y-1">
                  <div className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-black'}`}>
                    Analyzing Video Stream & Extracting Keyframes...
                  </div>
                  <div className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Running YOLOv8-Seg deep underwater model at 60 FPS
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto space-y-1">
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className={`text-[10px] font-mono text-right font-bold ${darkMode ? 'text-[#FCD34D]' : 'text-amber-800'}`}>
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            ) : uploadedVideo ? (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                darkMode ? 'bg-[#0B132B] border-emerald-500/40 text-slate-100' : 'bg-emerald-50/80 border-emerald-300 text-black'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{uploadedVideo.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                        ACTIVE STREAM
                      </span>
                    </div>
                    <div className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Size: {uploadedVideo.size} | Status: Segmentation Pipeline Active (60 FPS)
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClearUploadedVideo}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragOver
                    ? darkMode ? 'bg-[#0B132B] border-[#FBBF24]' : 'bg-amber-100/50 border-amber-500'
                    : darkMode
                    ? 'bg-[#0B132B]/60 border-[#60A5FA]/30 hover:border-[#FBBF24]/60 hover:bg-[#0B132B]'
                    : 'bg-slate-50 border-slate-300 hover:border-amber-500 hover:bg-amber-50/30'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30">
                    <Upload className="w-6 h-6 text-[#FBBF24]" />
                  </div>
                  <div>
                    <span className={`font-bold text-sm ${darkMode ? 'text-slate-100' : 'text-black'}`}>
                      Click to upload video
                    </span>{' '}
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      or drag and drop video file here
                    </span>
                  </div>
                  <div className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Supported Formats: MP4, WEBM, MOV, AVI (Max 500 MB)
                  </div>
                </div>
              </div>
            )}

            {/* Sample Underwater Video Feed Presets */}
            <div className="space-y-2">
              <div className={`text-xs font-mono font-bold uppercase tracking-wider ${
                darkMode ? 'text-slate-400' : 'text-slate-700'
              }`}>
                Or Select Sample ROV Feeds:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    title: 'Visakhapatnam Deep Trench',
                    size: '48.2 MB',
                    desc: 'High turbidity debris zone',
                    url: HERO_IMAGE_URL,
                  },
                  {
                    title: 'Malvan Coral Reef ROV',
                    size: '32.1 MB',
                    desc: 'Ghost net & plastic survey',
                    url: SAMPLE_TURBID_IMAGE_URL,
                  },
                  {
                    title: 'Mumbai Coastal Harbor',
                    size: '56.4 MB',
                    desc: 'Dense industrial waste feed',
                    url: HERO_IMAGE_URL,
                  },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPresetVideo(sample.title, sample.url, sample.size)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      darkMode
                        ? 'bg-[#0B132B] border-[#60A5FA]/20 hover:border-[#FBBF24] hover:bg-[#1A233A]'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-black'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${darkMode ? 'text-slate-100' : 'text-black'}`}>
                        {sample.title}
                      </div>
                      <div className={`text-[10px] font-mono truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {sample.desc} ({sample.size})
                      </div>
                    </div>
                    <PlayCircle className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Keyframe Analytics & Box Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-2xl border shadow-md space-y-4 transition-colors ${
            darkMode ? 'bg-[#1A233A] border-[#60A5FA]/30' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 pb-2 border-b ${
              darkMode ? 'text-[#FBBF24] border-[#60A5FA]/20' : 'text-amber-600 border-slate-200'
            }`}>
              <Activity className="w-4 h-4 text-[#FBBF24]" />
              Keyframe Analytics ({activeKeyframe.timestampFormatted})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border text-xs ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FRAME DEBRIS COUNT</div>
                <div className={`text-2xl font-black font-mono mt-0.5 ${darkMode ? 'text-[#FCD34D]' : 'text-amber-700'}`}>
                  {activeKeyframe.debrisCount} Items
                </div>
              </div>
              <div className={`p-3 rounded-xl border text-xs ${
                darkMode ? 'bg-[#0B132B] border-[#60A5FA]/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DOMINANT CLASS</div>
                <div className="text-sm font-bold text-[#FB7185] truncate mt-1">
                  {activeKeyframe.dominantClass}
                </div>
              </div>
            </div>

            {/* Bounding Box Items List in current frame */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                darkMode ? 'text-[#FBBF24]' : 'text-amber-600'
              }`}>
                Active Bounding Objects in Frame
              </div>
              {activeKeyframe.boxes.map((box) => (
                <div
                  key={box.id}
                  onClick={() => setSelectedBoxId(box.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedBoxId === box.id
                      ? darkMode
                        ? 'bg-[#0B132B] border-[#FBBF24] ring-1 ring-[#FBBF24] shadow-sm'
                        : 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                      : darkMode
                      ? 'bg-[#0B132B] border-[#60A5FA]/20 hover:border-[#60A5FA]/50'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`flex justify-between items-center font-bold ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    <span>{box.label}</span>
                    <span className={`font-mono text-[10px] font-bold ${
                      darkMode ? 'text-[#FCD34D]' : 'text-amber-700'
                    }`}>{(box.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className={`flex justify-between text-[10px] font-mono mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Area: {box.estAreaCm2} cm²</span>
                    <span className="text-[#FB7185] font-bold">{box.riskLevel} Risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
