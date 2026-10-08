import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  EyeOff,
  Columns,
  Download,
  Crosshair,
} from 'lucide-react';

export default function ImageViewer({
  originalSrc,
  annotatedSrc,
  filename = 'survey-image.jpg',
  detections = [],
  hoveredDetId = null,
  onHoverDet = () => {},
  isAnalyzing = false,
}) {
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated' | 'original' | 'split'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [originalSrc, annotatedSrc]);

  // Handle Zoom In
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // Reset Zoom
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Pan dragging
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Download active image
  const handleDownload = () => {
    const activeSrc = viewMode === 'annotated' && annotatedSrc ? annotatedSrc : originalSrc;
    if (!activeSrc) return;

    const link = document.createElement('a');
    link.href = activeSrc;
    const prefix = viewMode === 'annotated' ? 'annotated-' : 'raw-';
    link.download = `${prefix}${filename || 'nirmalsagar-survey.jpg'}`;
    link.click();
  };

  const currentDisplaySrc =
    viewMode === 'annotated' && annotatedSrc ? annotatedSrc : originalSrc;

  return (
    <div
      ref={containerRef}
      className={`ns-image-viewer-root ${isFullscreen ? 'ns-viewer-fullscreen' : ''}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Viewer Toolbar */}
      <div className="ns-viewer-toolbar">
        {/* Left: View Mode Controls */}
        <div className="ns-viewer-toolbar-left">
          {annotatedSrc && (
            <div className="ns-viewmode-segmented">
              <button
                type="button"
                className={`ns-seg-btn ${viewMode === 'annotated' ? 'active' : ''}`}
                onClick={() => setViewMode('annotated')}
                title="Annotated with YOLO bounding boxes and masks"
              >
                <Eye size={13} />
                <span>Annotated</span>
              </button>
              <button
                type="button"
                className={`ns-seg-btn ${viewMode === 'original' ? 'active' : ''}`}
                onClick={() => setViewMode('original')}
                title="Original raw underwater image"
              >
                <EyeOff size={13} />
                <span>Original</span>
              </button>
              <button
                type="button"
                className={`ns-seg-btn ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
                title="Side-by-side comparison"
              >
                <Columns size={13} />
                <span>Side by Side</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Pan/Zoom & Utility Actions */}
        <div className="ns-viewer-toolbar-right">
          <div className="ns-zoom-controls">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="ns-tool-btn"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="ns-zoom-indicator">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="ns-tool-btn"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="ns-tool-btn"
              title="Reset zoom to 100%"
              aria-label="Reset zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          <div className="ns-toolbar-divider" />

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="ns-tool-btn"
            title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="ns-tool-btn"
            title="Download image"
            aria-label="Download image"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        className={`ns-viewer-viewport ${isDragging ? 'dragging' : ''} ${
          zoom > 1 ? 'can-drag' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {isAnalyzing && (
          <div className="ns-scanning-overlay">
            <div className="ns-scanner-line" />
            <div className="ns-scanner-badge">
              <span className="ns-spin-dot" />
              <span>Analyzing underwater image with YOLOv11s...</span>
            </div>
          </div>
        )}

        {viewMode === 'split' && annotatedSrc ? (
          /* Side-by-side view */
          <div className="ns-split-view-container">
            <div className="ns-split-view-pane">
              <div className="ns-pane-label">Original Image</div>
              <img
                src={originalSrc}
                alt="Raw underwater survey"
                className="ns-split-img"
              />
            </div>
            <div className="ns-split-view-pane">
              <div className="ns-pane-label">Annotated Result</div>
              <img
                src={annotatedSrc}
                alt="Annotated detection result"
                className="ns-split-img"
              />
            </div>
          </div>
        ) : (
          /* Single Image View with Pan & Zoom */
          <div
            className="ns-image-stage"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <img
              src={currentDisplaySrc}
              alt="Underwater benthic survey"
              className="ns-display-image"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Viewport HUD info */}
      <div className="ns-viewer-hud">
        <span className="ns-hud-tag">{filename}</span>
        {detections.length > 0 && (
          <span className="ns-hud-tag ns-hud-accent">
            <Crosshair size={11} />
            {detections.length} Detected Object{detections.length === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </div>
  );
}
