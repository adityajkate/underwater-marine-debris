import React, { useState, useRef, useMemo } from 'react';
import {
  Video,
  FolderOpen,
  Play,
  Pause,
  RotateCcw,
  Film,
  AlertCircle,
  Clock,
  RefreshCw,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import PageHeader from '../common/PageHeader';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyzeVideo } from '../../services/inferenceService';
import APP_CONFIG from '../../config/appConfig';

export default function VideoDetectionView({ onNavigate }) {
  const { demoMode, setCurrentAnalysis, addHistoryItem, settings } = useAnalysis();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [fpsSampling, setFpsSampling] = useState(2);

  // Playback state driving the annotation overlay
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const fileInputRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Validate & Load Video File
  const handleVideoFile = (file) => {
    if (!file) return;

    const validExtensions = /\.(mp4|avi|mov|webm|mkv)$/i;
    const validMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

    if (!validMimes.includes(file.type) && !file.name.match(validExtensions)) {
      setError('Please select a supported video format (MP4, WebM, MOV, AVI).');
      return;
    }

    const MAX_SIZE = 150 * 1024 * 1024; // 150MB
    if (file.size > MAX_SIZE) {
      setError('Video file exceeds 150MB maximum upload limit.');
      return;
    }

    setError(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedVideo(file);
    setVideoUrl(URL.createObjectURL(file));
    setVideoMeta(null);
    setAnalysisResult(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleVideoFile(file);
  };

  // Video metadata extraction once loaded — drives the aspect-correct frame box
  const handleLoadedMetadata = () => {
    const vid = videoPlayerRef.current;
    if (!vid) return;

    const naturalWidth = vid.videoWidth || 16;
    const naturalHeight = vid.videoHeight || 9;

    setVideoMeta({
      duration: vid.duration || 30,
      durationFormatted: formatDuration(vid.duration || 30),
      width: naturalWidth,
      height: naturalHeight,
      sizeMb: (selectedVideo?.size ? selectedVideo.size / (1024 * 1024) : 0).toFixed(1),
      estimatedFrames: Math.round((vid.duration || 30) * 30),
    });
    setDuration(vid.duration || 0);
    setCurrentTime(vid.currentTime || 0);
  };

  // Trigger video analysis
  const handleStartAnalysis = async () => {
    if (!videoUrl) return;
    if (!videoMeta) {
      setError('Video metadata is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      setProcessingStage('Ingesting video stream & sampling temporal frames...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('Running marine debris detection on sampled frames...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage('Aggregating temporal tracks & compiling detection timeline...');

      const result = await analyzeVideo(selectedVideo, {
        demoMode,
        fpsSampling,
        duration: videoMeta.duration || 32,
        width: videoMeta.width,
        height: videoMeta.height,
        filename: selectedVideo?.name || 'Transect_Survey.mp4',
        videoUrl,
      });

      setAnalysisResult(result);
      setShowAnnotations(true);

      // Save to global context for pollution analysis & history
      const formattedForContext = {
        type: 'video',
        filename: result.filename,
        numDetections: result.numDetections,
        classBreakdown: result.classBreakdown,
        durationMs: result.durationMs,
        isDemo: result.isDemo,
        timestamp: result.timestamp,
        detections: result.keyframes.flatMap((kf) => kf.detectedObjects),
      };

      setCurrentAnalysis(formattedForContext);

      if (settings.autoSaveHistory) {
        addHistoryItem(formattedForContext);
      }
    } catch (err) {
      setError(err.message || 'Video analysis failed.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedVideo(null);
    setVideoUrl(null);
    setVideoMeta(null);
    setAnalysisResult(null);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Seek the player to a temporal keyframe
  const jumpToKeyframe = (kf) => {
    if (videoPlayerRef.current && kf.timestampSec != null) {
      videoPlayerRef.current.currentTime = kf.timestampSec;
      setCurrentTime(kf.timestampSec);
    }
  };

  const togglePlay = () => {
    const vid = videoPlayerRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const handleRestart = () => {
    const vid = videoPlayerRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    setCurrentTime(0);
    vid.play().catch(() => {});
  };

  const handleSeek = (e) => {
    const next = Number(e.target.value);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = next;
    }
    setCurrentTime(next);
  };

  // Natural frame size used for both the viewer box and annotation scaling.
  // Using the same pair guarantees boxes never drift, whatever the aspect ratio.
  const frameWidth = videoMeta?.width || analysisResult?.videoWidth || 16;
  const frameHeight = videoMeta?.height || analysisResult?.videoHeight || 9;

  // Active temporal window — detections are shown while playback is inside it
  const activeKeyframeIndex = useMemo(() => {
    const keyframes = analysisResult?.keyframes;
    if (!keyframes || keyframes.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < keyframes.length; i += 1) {
      if (currentTime + 0.0001 >= keyframes[i].timestampSec) idx = i;
    }
    return idx;
  }, [analysisResult, currentTime]);

  const activeDetections = useMemo(() => {
    const keyframes = analysisResult?.keyframes;
    if (!keyframes || activeKeyframeIndex < 0) return [];
    return keyframes[activeKeyframeIndex]?.detectedObjects || [];
  }, [analysisResult, activeKeyframeIndex]);

  return (
    <div className="ns-workbench-stage">
      <PageHeader
        title="Video Detection"
        subtitle="Process underwater benthic transect footage to identify marine debris across temporal sequences."
        badge="Temporal Detection Pipeline"
      />

      {error && (
        <div className="ns-workbench-alert" role="alert">
          <AlertCircle size={18} className="ns-alert-icon" />
          <div className="ns-alert-text">
            <strong>Video Processing Notice:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="ns-alert-dismiss"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="ns-workbench-grid">
        {/* Left Column: Video Ingestion, Annotated Player & Transport Controls */}
        <div className="ns-stage-card">
          {!videoUrl ? (
            <div
              className="ns-upload-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="ns-upload-icon-circle">
                <Video size={32} strokeWidth={1.75} />
              </div>

              <h3 className="ns-upload-title">Upload Transect Video</h3>
              <p className="ns-upload-subtitle">
                Drag and drop underwater footage or click to browse
              </p>

              <div className="ns-upload-specs">
                <span>MP4, WebM, MOV</span>
                <span>•</span>
                <span>Up to 150MB</span>
              </div>

              <button
                type="button"
                className="ns-btn-secondary ns-btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FolderOpen size={14} />
                Select Video File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                aria-label="Upload underwater video"
              />
            </div>
          ) : (
            <div className="ns-viewer-wrapper">
              {/* Aspect-correct frame: the box matches the source video ratio, so
                  the video never stretches and the overlay never drifts. */}
              <div
                className="ns-video-frame"
                style={{
                  aspectRatio: `${frameWidth} / ${frameHeight}`,
                  width: `min(100%, calc(62vh * ${frameWidth} / ${frameHeight}))`,
                }}
              >
                <video
                  ref={videoPlayerRef}
                  src={videoUrl}
                  className="ns-main-video-player"
                  preload="metadata"
                  onClick={togglePlay}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Detection overlay — percentage based, scales with the frame */}
                {analysisResult && showAnnotations && (
                  <div className="ns-annotation-layer">
                    {activeDetections.map((det) => {
                      const taxonomy =
                        APP_CONFIG.TAXONOMY[det.class] || APP_CONFIG.TAXONOMY.other;
                      const [bx, by, bw, bh] = det.bbox;
                      return (
                        <div
                          key={`${activeKeyframeIndex}-${det.id}`}
                          className="ns-video-ann-box"
                          style={{
                            left: `${(bx / frameWidth) * 100}%`,
                            top: `${(by / frameHeight) * 100}%`,
                            width: `${(bw / frameWidth) * 100}%`,
                            height: `${(bh / frameHeight) * 100}%`,
                            borderColor: taxonomy.color,
                            backgroundColor: `${taxonomy.color}1f`,
                          }}
                        >
                          <span
                            className="ns-video-ann-label"
                            style={{ backgroundColor: taxonomy.color }}
                          >
                            {taxonomy.shortLabel} {Math.round(det.confidence)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isProcessing && (
                  <div className="ns-scanning-overlay">
                    <div className="ns-scanner-line" />
                    <div className="ns-scanner-badge">
                      <Loader2 size={16} className="ns-spin" />
                      <span>{processingStage}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Transport controls: play / pause / seek / restart / overlay toggle */}
              <div className="ns-video-controls">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="ns-video-ctrl-btn ns-video-ctrl-primary"
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="ns-video-ctrl-btn"
                  title="Restart"
                  aria-label="Restart video"
                >
                  <RotateCcw size={14} />
                </button>

                <span className="ns-video-time">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </span>

                <input
                  type="range"
                  className="ns-video-seek"
                  min={0}
                  max={duration || 0}
                  step={0.01}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  disabled={!duration}
                  aria-label="Seek video"
                />

                {analysisResult && (
                  <button
                    type="button"
                    onClick={() => setShowAnnotations((v) => !v)}
                    className={`ns-video-ctrl-btn ${showAnnotations ? 'active' : ''}`}
                    title={showAnnotations ? 'Hide detections' : 'Show detections'}
                    aria-label="Toggle detection overlay"
                  >
                    {showAnnotations ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span className="ns-video-ctrl-text">Boxes</span>
                  </button>
                )}
              </div>

              {/* Action Bar Below Player */}
              <div className="ns-viewer-bottom-bar">
                <div className="ns-file-meta-tag">
                  <span className="ns-file-name">{selectedVideo?.name || 'Transect_Survey.mp4'}</span>
                  {videoMeta && (
                    <span className="ns-file-dim">
                      {videoMeta.durationFormatted} • {videoMeta.width}×{videoMeta.height} (
                      {videoMeta.sizeMb} MB)
                    </span>
                  )}
                </div>

                <div className="ns-viewer-btn-row">
                  <button
                    onClick={handleReset}
                    className="ns-btn-secondary ns-btn-sm"
                    disabled={isProcessing}
                  >
                    <RefreshCw size={13} />
                    Change Video
                  </button>

                  <button
                    onClick={handleStartAnalysis}
                    disabled={isProcessing || !videoMeta}
                    className="ns-btn-primary ns-btn-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={13} className="ns-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        {analysisResult ? 'Re-Analyze Video' : 'Analyze Video'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Video Analytics & Keyframe Timeline */}
        <div className="ns-controls-card">
          {!analysisResult ? (
            <div className="ns-empty-controls">
              <div className="ns-empty-controls-inner">
                <Film size={36} className="ns-icon-faint" />
                <h3 className="ns-empty-title">Temporal Sequence Inference</h3>
                <p className="ns-empty-desc">
                  {videoUrl
                    ? 'Video loaded. Click "Analyze Video" to extract sampled frames and detect marine debris throughout the transect.'
                    : 'Upload underwater ROV/AUV or diver transect footage to inspect temporal debris concentration.'}
                </p>

                {videoUrl && (
                  <div style={{ marginTop: 20, width: '100%' }}>
                    <div className="ns-filter-box" style={{ marginBottom: 16 }}>
                      <div className="ns-filter-header">
                        <label className="ns-filter-label">Sampling Frequency</label>
                        <span className="ns-filter-val">{fpsSampling} FPS</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={fpsSampling}
                        onChange={(e) => setFpsSampling(Number(e.target.value))}
                        className="ns-range-slider"
                      />
                    </div>

                    <button
                      onClick={handleStartAnalysis}
                      disabled={isProcessing || !videoMeta}
                      className="ns-btn-primary"
                      style={{ width: '100%' }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={15} className="ns-spin" />
                          Processing Video...
                        </>
                      ) : (
                        <>
                          <Play size={15} />
                          Analyze Video
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ns-results-container">
              {/* Summary Header */}
              <div className="ns-results-header">
                <div className="ns-results-title-group">
                  <h3 className="ns-results-heading">Detection Summary</h3>
                  <span className="ns-results-badge">Analysis Complete</span>
                </div>
                <span className="ns-results-time">{analysisResult.durationMs}ms</span>
              </div>

              {/* Metrics Strip */}
              <div className="ns-summary-metrics-row">
                <div className="ns-summary-metric">
                  <span className="ns-summary-metric-val">{analysisResult.numDetections}</span>
                  <span className="ns-summary-metric-lbl">Objects Detected</span>
                </div>

                <div className="ns-summary-metric">
                  <span className="ns-summary-metric-val">
                    {Object.keys(analysisResult.classBreakdown || {}).length}
                  </span>
                  <span className="ns-summary-metric-lbl">Detected Classes</span>
                </div>

                <div className="ns-summary-metric">
                  <span className="ns-summary-metric-val">{analysisResult.durationMs}ms</span>
                  <span className="ns-summary-metric-lbl">Processing Time</span>
                </div>
              </div>

              {/* Aggregated Class Breakdown */}
              <div className="ns-breakdown-section">
                <h4 className="ns-sub-heading">Detected Debris Breakdown</h4>
                <div className="ns-class-chips-grid">
                  {Object.entries(analysisResult.classBreakdown || {}).map(([cls, count]) => {
                    const taxonomy = APP_CONFIG.TAXONOMY[cls] || APP_CONFIG.TAXONOMY.other;
                    return (
                      <div
                        key={cls}
                        className="ns-class-chip"
                        style={{ borderLeftColor: taxonomy.color }}
                      >
                        <div className="ns-class-chip-info">
                          <span className="ns-chip-dot" style={{ backgroundColor: taxonomy.color }} />
                          <span className="ns-chip-name">{taxonomy.label}</span>
                        </div>
                        <span className="ns-chip-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temporal Timeline Keyframes — click to seek the annotated player */}
              <div className="ns-detections-list-section">
                <div className="ns-detections-header-row">
                  <h4 className="ns-sub-heading">Detection Timeline</h4>
                  <span className="ns-table-count-tag">
                    {analysisResult.keyframes.length} window
                    {analysisResult.keyframes.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="ns-timeline-keyframes-list">
                  {analysisResult.keyframes.map((kf, idx) => {
                    const isActive = activeKeyframeIndex === idx;
                    return (
                      <div
                        key={`${kf.timecode}-${idx}`}
                        className={`ns-keyframe-card ${isActive ? 'active' : ''}`}
                        onClick={() => jumpToKeyframe(kf)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && jumpToKeyframe(kf)}
                      >
                        <div className="ns-keyframe-header">
                          <span className="ns-keyframe-timecode">
                            <Clock size={12} />
                            {kf.timecode}
                          </span>
                          <span className="ns-keyframe-count">
                            {kf.detectedObjects.length} object
                            {kf.detectedObjects.length === 1 ? '' : 's'}
                          </span>
                        </div>

                        <div className="ns-keyframe-objects">
                          {kf.detectedObjects.map((obj) => {
                            const taxonomy =
                              APP_CONFIG.TAXONOMY[obj.class] || APP_CONFIG.TAXONOMY.other;
                            return (
                              <span
                                key={obj.id}
                                className="ns-kf-obj-pill"
                                style={{
                                  backgroundColor: taxonomy.bgTint,
                                  color: taxonomy.color,
                                  borderColor: taxonomy.color,
                                }}
                              >
                                {taxonomy.shortLabel} {Math.round(obj.confidence)}%
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('pollution-analysis')}
                  className="ns-btn-primary"
                  style={{ width: '100%', marginTop: 12 }}
                >
                  <ShieldAlert size={15} />
                  Assess Video Pollution Hazard
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
