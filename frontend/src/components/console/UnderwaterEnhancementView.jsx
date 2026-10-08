import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  UploadCloud,
  FolderOpen,
  RefreshCw,
  Download,
  ArrowRight,
  Sliders,
  Eye,
  EyeOff,
  Columns,
  SplitSquareVertical,
  Info,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import PageHeader from '../common/PageHeader';
import StatusBadge from '../common/StatusBadge';

const DEFAULT_FILTERS = {
  brightness: 110,   // %
  contrast: 125,     // %
  saturate: 120,     // %
  dehaze: 30,        // % (custom blue-green attenuation)
  sharpness: 20,     // %
};

export default function UnderwaterEnhancementView({ onNavigate }) {
  const { setEnhancedImageTransfer } = useAnalysis();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [enhancedDataUrl, setEnhancedDataUrl] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [compareMode, setCompareMode] = useState('slider'); // 'slider' | 'side-by-side' | 'enhanced' | 'original'
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [activePreset, setActivePreset] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const isDraggingSlider = useRef(false);

  // Handle image upload
  const handleImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image format (JPG, PNG, WebP).');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setActivePreset(null);
    setFilters(DEFAULT_FILTERS);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  // Render client-side enhancement using HTML5 Canvas
  const applyEnhancementsToCanvas = useCallback(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply CSS-compatible filters on canvas context
      const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`;
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);

      // Perform pixel-level underwater color correction (attenuate excess cyan/green, boost red)
      if (filters.dehaze > 0) {
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const dehazeFactor = filters.dehaze / 100;

          for (let i = 0; i < data.length; i += 4) {
            // Boost red channel (most absorbed in water)
            data[i] = Math.min(255, data[i] * (1 + dehazeFactor * 0.45));
            // Slightly compress dominating green/blue tint
            data[i + 1] = Math.max(0, data[i + 1] * (1 - dehazeFactor * 0.12));
            data[i + 2] = Math.max(0, data[i + 2] * (1 - dehazeFactor * 0.1));
          }
          ctx.putImageData(imgData, 0, 0);
        } catch {
          // Cross-origin fallback handled gracefully
        }
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setEnhancedDataUrl(dataUrl);
    };
    img.src = imageSrc;
  }, [imageSrc, filters]);

  useEffect(() => {
    applyEnhancementsToCanvas();
  }, [applyEnhancementsToCanvas]);

  // Presets
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    switch (presetName) {
      case 'deep-ocean':
        setFilters({ brightness: 120, contrast: 135, saturate: 130, dehaze: 45, sharpness: 30 });
        break;
      case 'turbid-coastal':
        setFilters({ brightness: 115, contrast: 140, saturate: 110, dehaze: 60, sharpness: 40 });
        break;
      case 'low-light':
        setFilters({ brightness: 140, contrast: 120, saturate: 115, dehaze: 25, sharpness: 15 });
        break;
      case 'reset':
      default:
        setActivePreset(null);
        setFilters(DEFAULT_FILTERS);
        break;
    }
  };

  // Slider dragging
  const handleSliderMove = (e) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const startDrag = () => {
    isDraggingSlider.current = true;
  };
  const stopDrag = () => {
    isDraggingSlider.current = false;
  };

  // Transfer enhanced image to Image Detection
  const handleSendToDetection = () => {
    if (!enhancedDataUrl) return;

    // Convert dataURL to Blob
    fetch(enhancedDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        setEnhancedImageTransfer({
          dataUrl: enhancedDataUrl,
          blob,
          filename: `enhanced-${selectedFile?.name || 'survey-image.jpg'}`,
        });
        if (onNavigate) {
          onNavigate('image-detection');
        }
      });
  };

  // Download enhanced image
  const handleDownloadEnhanced = () => {
    if (!enhancedDataUrl) return;
    const link = document.createElement('a');
    link.href = enhancedDataUrl;
    link.download = `enhanced-${selectedFile?.name || 'underwater-survey.jpg'}`;
    link.click();
  };

  return (
    <div className="ns-workbench-stage">
      <PageHeader
        title="Underwater Image Enhancement"
        subtitle="Restore optical clarity, correct water column wavelength attenuation, and de-haze benthic surveys."
        badge="Pre-Processing"
      >
        {enhancedDataUrl && onNavigate && (
          <button onClick={handleSendToDetection} className="ns-btn-primary">
            <span>Send to Image Detection</span>
            <ArrowRight size={15} />
          </button>
        )}
      </PageHeader>

      <div className="ns-workbench-grid">
        {/* Left Column: Stage & Interactive Comparison Viewer */}
        <div className="ns-stage-card">
          {!imageSrc ? (
            <div
              className="ns-upload-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageFile(file);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="ns-upload-icon-circle">
                <Sparkles size={32} strokeWidth={1.75} />
              </div>

              <h3 className="ns-upload-title">Upload Murky or Turbid Image</h3>
              <p className="ns-upload-subtitle">
                Select underwater imagery to preview real-time enhancement filters
              </p>
              <span className="ns-upload-formats-hint">Supports JPG, JPEG, PNG, WebP</span>

              <div className="ns-upload-btn-group" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ns-btn-choose"
                >
                  <FolderOpen size={15} />
                  Choose Survey Image
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="ns-active-enhancer-container">
              {/* Toolbar */}
              <div className="ns-stage-subbar">
                <div className="ns-viewmode-segmented">
                  <button
                    type="button"
                    className={`ns-seg-btn ${compareMode === 'slider' ? 'active' : ''}`}
                    onClick={() => setCompareMode('slider')}
                  >
                    <SplitSquareVertical size={13} />
                    <span>Split Slider</span>
                  </button>
                  <button
                    type="button"
                    className={`ns-seg-btn ${compareMode === 'side-by-side' ? 'active' : ''}`}
                    onClick={() => setCompareMode('side-by-side')}
                  >
                    <Columns size={13} />
                    <span>Side-by-Side</span>
                  </button>
                  <button
                    type="button"
                    className={`ns-seg-btn ${compareMode === 'enhanced' ? 'active' : ''}`}
                    onClick={() => setCompareMode('enhanced')}
                  >
                    <Eye size={13} />
                    <span>Enhanced</span>
                  </button>
                  <button
                    type="button"
                    className={`ns-seg-btn ${compareMode === 'original' ? 'active' : ''}`}
                    onClick={() => setCompareMode('original')}
                  >
                    <EyeOff size={13} />
                    <span>Original</span>
                  </button>
                </div>

                <div className="ns-stage-actions">
                  <button
                    onClick={() => {
                      setImageSrc(null);
                      setSelectedFile(null);
                      setEnhancedDataUrl(null);
                    }}
                    className="ns-btn-secondary ns-btn-sm"
                  >
                    <RefreshCw size={13} />
                    New Image
                  </button>

                  <button
                    onClick={handleDownloadEnhanced}
                    className="ns-btn-secondary ns-btn-sm"
                    title="Download enhanced image"
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>

              {/* Enhancement Comparison Stage */}
              <div className="ns-enhancer-viewport">
                {compareMode === 'slider' && (
                  <div
                    ref={sliderContainerRef}
                    className="ns-split-slider-container"
                    onMouseMove={(e) => isDraggingSlider.current && handleSliderMove(e)}
                    onTouchMove={handleSliderMove}
                    onMouseUp={stopDrag}
                    onTouchEnd={stopDrag}
                  >
                    {/* Background: Original Image */}
                    <img
                      src={imageSrc}
                      alt="Original raw underwater"
                      className="ns-split-base-img"
                      draggable={false}
                    />
                    <div className="ns-slider-pane-tag tag-left">Original</div>

                    {/* Foreground: Enhanced Image clipped by slider position */}
                    <div
                      className="ns-split-clipped-overlay"
                      style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    >
                      <img
                        src={enhancedDataUrl || imageSrc}
                        alt="Enhanced underwater survey"
                        className="ns-split-overlay-img"
                        draggable={false}
                      />
                      <div className="ns-slider-pane-tag tag-right">Enhanced</div>
                    </div>

                    {/* Divider Line & Handle */}
                    <div
                      className="ns-slider-handle-line"
                      style={{ left: `${sliderPosition}%` }}
                      onMouseDown={startDrag}
                      onTouchStart={startDrag}
                    >
                      <div className="ns-slider-handle-thumb">
                        <span className="ns-thumb-arrow">◀</span>
                        <span className="ns-thumb-arrow">▶</span>
                      </div>
                    </div>
                  </div>
                )}

                {compareMode === 'side-by-side' && (
                  <div className="ns-split-view-container">
                    <div className="ns-split-view-pane">
                      <div className="ns-pane-label">Original Image</div>
                      <img src={imageSrc} alt="Original" className="ns-split-img" />
                    </div>
                    <div className="ns-split-view-pane">
                      <div className="ns-pane-label">Enhanced Preview</div>
                      <img
                        src={enhancedDataUrl || imageSrc}
                        alt="Enhanced"
                        className="ns-split-img"
                      />
                    </div>
                  </div>
                )}

                {compareMode === 'enhanced' && (
                  <div className="ns-single-enhancement-view">
                    <img
                      src={enhancedDataUrl || imageSrc}
                      alt="Enhanced result"
                      className="ns-display-image"
                    />
                  </div>
                )}

                {compareMode === 'original' && (
                  <div className="ns-single-enhancement-view">
                    <img src={imageSrc} alt="Original" className="ns-display-image" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Enhancement Controls */}
        <div className="ns-panel-card">
          <div className="ns-telemetry-panel">
            <div className="ns-panel-heading-row">
              <h4 className="ns-panel-title">Wavelength & Clarity Controls</h4>
              <StatusBadge status="info" text="Real-Time Canvas" />
            </div>

            {/* Presets Row */}
            <div className="ns-presets-section">
              <span className="ns-presets-label">Restoration Presets:</span>
              <div className="ns-presets-pills">
                <button
                  type="button"
                  onClick={() => applyPreset('deep-ocean')}
                  className={`ns-preset-pill ${activePreset === 'deep-ocean' ? 'active' : ''}`}
                >
                  Deep Ocean De-haze
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('turbid-coastal')}
                  className={`ns-preset-pill ${activePreset === 'turbid-coastal' ? 'active' : ''}`}
                >
                  Turbid Coastal
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('low-light')}
                  className={`ns-preset-pill ${activePreset === 'low-light' ? 'active' : ''}`}
                >
                  Low-Light Boost
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('reset')}
                  className="ns-preset-pill ns-preset-reset"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Manual Sliders */}
            <div className="ns-sliders-stack">
              <div className="ns-slider-control">
                <div className="ns-slider-header">
                  <span className="ns-slider-label">Underwater De-Haze (Red Channel Boost)</span>
                  <span className="ns-slider-val">{filters.dehaze}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.dehaze}
                  onChange={(e) => {
                    setActivePreset(null);
                    setFilters((prev) => ({ ...prev, dehaze: Number(e.target.value) }));
                  }}
                  className="ns-range-slider"
                  aria-label="De-haze"
                />
              </div>

              <div className="ns-slider-control">
                <div className="ns-slider-header">
                  <span className="ns-slider-label">Contrast Enhancement</span>
                  <span className="ns-slider-val">{filters.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => {
                    setActivePreset(null);
                    setFilters((prev) => ({ ...prev, contrast: Number(e.target.value) }));
                  }}
                  className="ns-range-slider"
                  aria-label="Contrast"
                />
              </div>

              <div className="ns-slider-control">
                <div className="ns-slider-header">
                  <span className="ns-slider-label">Luminance / Brightness</span>
                  <span className="ns-slider-val">{filters.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="180"
                  value={filters.brightness}
                  onChange={(e) => {
                    setActivePreset(null);
                    setFilters((prev) => ({ ...prev, brightness: Number(e.target.value) }));
                  }}
                  className="ns-range-slider"
                  aria-label="Brightness"
                />
              </div>

              <div className="ns-slider-control">
                <div className="ns-slider-header">
                  <span className="ns-slider-label">Color Saturation</span>
                  <span className="ns-slider-val">{filters.saturate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={filters.saturate}
                  onChange={(e) => {
                    setActivePreset(null);
                    setFilters((prev) => ({ ...prev, saturate: Number(e.target.value) }));
                  }}
                  className="ns-range-slider"
                  aria-label="Saturation"
                />
              </div>
            </div>

            {/* Scientific Notice */}
            <div className="ns-info-card">
              <div className="ns-info-card-header">
                <Info size={16} />
                <span>Restoration Methodology</span>
              </div>
              <p className="ns-info-card-body">
                Wavelength attenuation filters dynamically compensate for red-light absorption
                in benthic water columns, restoring natural color balance and local contrast
                across turbid survey imagery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
