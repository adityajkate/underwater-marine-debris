import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Download,
  AlertCircle,
  FolderOpen,
  Loader2,
  Scan,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  BarChart2,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Cpu,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyzeImage } from '../../services/inferenceService';
import ImageViewer from '../common/ImageViewer';
import StatusBadge from '../common/StatusBadge';
import APP_CONFIG from '../../config/appConfig';

export default function ImageAnalysisWorkbench({ onNavigate }) {
  const {
    settings,
    demoMode,
    currentAnalysis,
    setCurrentAnalysis,
    addHistoryItem,
    enhancedImageTransfer,
    setEnhancedImageTransfer,
    backendStatus,
  } = useAnalysis();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredDetId, setHoveredDetId] = useState(null);
  const [confidenceFilter, setConfidenceFilter] = useState(settings.defaultConfidenceThreshold || 20);
  const [imageMeta, setImageMeta] = useState(null);

  const fileInputRef = useRef(null);

  // If coming from Underwater Enhancement with an enhanced image:
  useEffect(() => {
    if (enhancedImageTransfer) {
      setPreviewUrl(enhancedImageTransfer.dataUrl);
      setSelectedFile({
        name: enhancedImageTransfer.filename || 'enhanced-survey-image.jpg',
        isEnhanced: true,
        blob: enhancedImageTransfer.blob,
      });
      setAnalysisResult(null);
      setError(null);
      setEnhancedImageTransfer(null);
    }
  }, [enhancedImageTransfer, setEnhancedImageTransfer]);

  // If an analysis was loaded from history/dashboard:
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.originalImage && !analysisResult) {
      setPreviewUrl(currentAnalysis.originalImage);
      setSelectedFile({
        name: currentAnalysis.filename,
        fromHistory: true,
      });
      setAnalysisResult(currentAnalysis);
    }
  }, [currentAnalysis, analysisResult]);

  // Handle file validation and loading
  const processImageFile = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setError('Please select a valid underwater image file (JPG, PNG, WebP).');
      return;
    }

    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('Selected image exceeds the 25MB maximum size limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setAnalysisResult(null);
    setCurrentAnalysis(null);

    const img = new Image();
    img.onload = () => {
      setImageMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeBytes: file.size,
      });
    };
    img.src = objectUrl;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // Run Inference (Calls central inference service)
  const handleAnalyze = async () => {
    if (!previewUrl || (!selectedFile && !enhancedImageTransfer)) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(selectedFile || previewUrl, {
        demoMode,
        backendUrl: settings.backendUrl,
        previewUrl,
        filename: selectedFile?.name || 'Survey_Image.jpg',
        dimensions: imageMeta || { width: 800, height: 600 },
      });

      setAnalysisResult(result);
      setCurrentAnalysis(result);

      if (settings.autoSaveHistory) {
        addHistoryItem({
          type: 'image',
          filename: result.filename,
          numDetections: result.numDetections,
          detections: result.detections,
          thumbnail: result.annotatedImage,
          annotatedImage: result.annotatedImage,
          originalImage: previewUrl,
          durationMs: result.durationMs,
          classBreakdown: result.classBreakdown,
          isDemo: result.isDemo,
          rawJson: result.rawJson,
        });
      }
    } catch (err) {
      console.error('Image analysis failed:', err);
      setError(err.message || 'Image analysis encountered an error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset current workspace
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setHoveredDetId(null);
    setImageMeta(null);
    setCurrentAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter detections by threshold
  const activeDetections = (analysisResult?.detections || []).filter(
    (d) => d.confidence >= confidenceFilter
  );

  const meanConfidence = activeDetections.length
    ? (
        activeDetections.reduce((sum, d) => sum + d.confidence, 0) /
        activeDetections.length
      ).toFixed(1)
    : 0;

  // Real class counts from filtered active detections
  const activeClassBreakdown = activeDetections.reduce((acc, d) => {
    const cls = d.class || 'plastic';
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="ns-workbench-stage">
      {/* Header */}
      <div className="ns-workbench-header">
        <div>
          <div className="ns-header-title-row">
            <h1 className="ns-workbench-title">Image Detection</h1>
            <span className="ns-header-badge">YOLOv11s Detection Engine</span>
          </div>
          <p className="ns-workbench-subtitle">
            Upload underwater imagery to identify, segment, and localize benthic marine debris.
          </p>
        </div>

        {analysisResult && onNavigate && (
          <div className="ns-header-actions">
            <button
              onClick={() => onNavigate('pollution-analysis')}
              className="ns-btn-secondary"
              title="Open Pollution Analysis with these detections"
            >
              <ShieldAlert size={15} />
              Assess Pollution Hazard
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="ns-workbench-alert" role="alert">
          <AlertCircle size={18} className="ns-alert-icon" />
          <div className="ns-alert-text">
            <strong>Inference Notice:</strong> {error}
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

      {/* Main Grid: Left Upload/Viewer, Right Controls & Results */}
      <div className="ns-workbench-grid">
        {/* Left Column: Image Ingestion & Visualizer */}
        <div className="ns-stage-card ns-stage-card-viewer">
          {!previewUrl ? (
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
                <UploadCloud size={32} strokeWidth={1.75} />
              </div>

              <h3 className="ns-upload-title">Upload Underwater Survey Image</h3>
              <p className="ns-upload-subtitle">
                Drag and drop benthic photograph or click to browse local files
              </p>

              <div className="ns-upload-specs">
                <span>JPG, PNG, WebP</span>
                <span>•</span>
                <span>Up to 25MB</span>
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
                Browse Files
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                aria-label="Upload underwater image"
              />
            </div>
          ) : (
            <div className="ns-viewer-wrapper">
              <ImageViewer
                originalSrc={previewUrl}
                annotatedSrc={analysisResult?.annotatedImage}
                filename={selectedFile?.name || 'Survey_Image.jpg'}
                detections={activeDetections}
                hoveredDetId={hoveredDetId}
                onHoverDet={setHoveredDetId}
                isAnalyzing={isAnalyzing}
              />

              {/* Action Bar Below Viewer */}
              <div className="ns-viewer-bottom-bar">
                <div className="ns-file-meta-tag">
                  {imageMeta && (
                    <span className="ns-file-dim">
                      {imageMeta.width} × {imageMeta.height} px
                    </span>
                  )}
                  {selectedFile?.isEnhanced && (
                    <span className="ns-tag-enhanced">Enhanced</span>
                  )}
                </div>

                <div className="ns-viewer-btn-row">
                  <button
                    onClick={handleReset}
                    className="ns-btn-secondary ns-btn-sm"
                    disabled={isAnalyzing}
                    type="button"
                  >
                    <RefreshCw size={13} />
                    Change Image
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="ns-btn-primary ns-btn-sm"
                    type="button"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={13} className="ns-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Scan size={13} />
                        {analysisResult ? 'Re-run Detection' : 'Run Detection'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Control & Detection Telemetry */}
        <div className="ns-controls-card">
          {!analysisResult ? (
            <div className="ns-empty-controls">
              <div className="ns-empty-controls-inner">
                <Scan size={36} className="ns-icon-faint" />
                <h3 className="ns-empty-title">Ready for Inference</h3>
                <p className="ns-empty-desc">
                  {previewUrl
                    ? 'Image loaded. Click "Run Detection" to trigger neural segmentation and identify marine debris.'
                    : 'Upload an underwater image to begin object detection and pollution classification.'}
                </p>

                {previewUrl && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="ns-btn-primary"
                    style={{ marginTop: 16 }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={15} className="ns-spin" />
                        Running Inference...
                      </>
                    ) : (
                      <>
                        <Scan size={15} />
                        Run Detection
                      </>
                    )}
                  </button>
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
                {analysisResult.durationMs ? (
                  <span className="ns-results-time">{analysisResult.durationMs}ms</span>
                ) : null}
              </div>

              {/* 1. Metric Cards Grid (Clean 2-column layout) */}
              <div className="ns-metrics-summary-grid">
                <div className="ns-summary-metric-card">
                  <span className="ns-metric-card-label">OBJECTS DETECTED</span>
                  <span className="ns-metric-card-value">{activeDetections.length}</span>
                </div>

                <div className="ns-summary-metric-card">
                  <span className="ns-metric-card-label">MEAN CONFIDENCE</span>
                  <span className="ns-metric-card-value">{meanConfidence}%</span>
                </div>

                <div className="ns-summary-metric-card">
                  <span className="ns-metric-card-label">PROCESSING TIME</span>
                  <span className="ns-metric-card-value">
                    {analysisResult.durationMs
                      ? `${(analysisResult.durationMs / 1000).toFixed(2)} s`
                      : '—'}
                  </span>
                </div>

                <div className="ns-summary-metric-card">
                  <span className="ns-metric-card-label">CONFIDENCE FILTER</span>
                  <span className="ns-metric-card-value">{confidenceFilter}%</span>
                </div>

                <div className="ns-summary-metric-card ns-metric-card-full">
                  <span className="ns-metric-card-label">DEBRIS CLASSES</span>
                  <span className="ns-metric-card-value">
                    {Object.keys(activeClassBreakdown).length}
                  </span>
                </div>
              </div>

              {/* 2. Confidence Threshold Filter Control */}
              <div className="ns-threshold-control-card">
                <div className="ns-threshold-header">
                  <span className="ns-threshold-label">Confidence Threshold</span>
                  <span className="ns-threshold-value">{confidenceFilter}%</span>
                </div>
                <input
                  id="conf-slider"
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(Number(e.target.value))}
                  className="ns-range-slider"
                  aria-label="Confidence threshold filter"
                />
              </div>

              {/* 3. Class Distribution Breakdown */}
              <div className="ns-breakdown-section">
                <h4 className="ns-sub-heading">Class Breakdown</h4>
                <div className="ns-class-chips-grid">
                  {Object.entries(activeClassBreakdown).map(([cls, count]) => {
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

              {/* 4. Detections Detailed List Table */}
              <div className="ns-detections-list-section">
                <div className="ns-detections-header-row">
                  <h4 className="ns-sub-heading">Segmented Targets</h4>
                  <span className="ns-table-count-tag">
                    {activeDetections.length} target{activeDetections.length === 1 ? '' : 's'}
                  </span>
                </div>

                {activeDetections.length === 0 ? (
                  <p className="ns-hint-muted">
                    No detections meet the {confidenceFilter}% confidence threshold.
                  </p>
                ) : (
                  <div className="ns-det-table-wrapper">
                    <table className="ns-det-table">
                      <thead>
                        <tr>
                          <th style={{ width: '36px' }}>#</th>
                          <th>Class</th>
                          <th>Confidence</th>
                          <th style={{ minWidth: '110px' }}>Bounding Box</th>
                          <th>Threat Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeDetections.map((det) => {
                          const taxonomy = APP_CONFIG.TAXONOMY[det.class] || APP_CONFIG.TAXONOMY.other;
                          const isHovered = hoveredDetId === det.id;
                          return (
                            <tr
                              key={det.id}
                              className={isHovered ? 'row-hovered' : ''}
                              onMouseEnter={() => setHoveredDetId(det.id)}
                              onMouseLeave={() => setHoveredDetId(null)}
                            >
                              <td className="ns-td-index">{det.id}</td>
                              <td>
                                <span
                                  className="ns-det-badge"
                                  style={{
                                    backgroundColor: taxonomy.bgTint,
                                    color: taxonomy.color,
                                    borderColor: taxonomy.color,
                                  }}
                                >
                                  {taxonomy.shortLabel}
                                </span>
                              </td>
                              <td className="ns-td-conf">
                                <strong>{det.confidence}%</strong>
                              </td>
                              <td className="ns-mono-text">
                                [{det.bbox.slice(0, 4).join(', ')}]
                              </td>
                              <td>
                                <span className={`ns-threat-tag threat-${det.threatLevel?.toLowerCase() || 'medium'}`}>
                                  {det.threatLevel || 'Medium'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Assessment Action */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('pollution-analysis')}
                  className="ns-btn-primary"
                  style={{ width: '100%', marginTop: 14 }}
                >
                  <ShieldAlert size={15} />
                  Proceed to Pollution Analysis
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
