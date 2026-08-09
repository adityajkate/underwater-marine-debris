import React from 'react';

export default function AnalysisResultsPanel({ results, isAnalyzing, hasImage }) {
  if (isAnalyzing) {
    return (
      <div className="ns-panel ns-panel-empty">
        <div className="ns-spinner"></div>
        <h3 className="ns-empty-title">Analyzing image...</h3>
        <p className="ns-empty-desc">Running YOLO11-seg inference on underwater debris features.</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="ns-panel ns-panel-empty">
        <div className="ns-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8cb8b3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="9" y2="15"></line>
            <line x1="12" y1="12" x2="12" y2="15"></line>
            <line x1="15" y1="7" x2="15" y2="15"></line>
          </svg>
        </div>
        {hasImage ? (
          <>
            <h3 className="ns-empty-title">Image Ready for Analysis</h3>
            <p className="ns-empty-desc">Click <strong>Analyze Image</strong> to run underwater debris detection.</p>
          </>
        ) : (
          <>
            <h3 className="ns-empty-title">Waiting for analysis...</h3>
            <p className="ns-empty-desc">Select an underwater image to begin.</p>
          </>
        )}
      </div>
    );
  }

  const { summary = {}, detections = [] } = results;
  const totalObjectsCount = detections.length;
  const uniqueTrashTypesCount = new Set(detections.map((d) => d.label)).size;

  return (
    <div className="ns-panel ns-results-panel">
      <div className="ns-panel-header">
        <h3 className="ns-panel-title">Analysis Results</h3>
      </div>

      {/* Summary Metrics */}
      <div className="ns-metrics-grid">
        <div className="ns-metric-card">
          <span className="ns-metric-label">Total Objects</span>
          <span className="ns-metric-value">{totalObjectsCount}</span>
        </div>
        <div className="ns-metric-card">
          <span className="ns-metric-label">Trash Types</span>
          <span className="ns-metric-value">{uniqueTrashTypesCount}</span>
        </div>
        <div className="ns-metric-card full-width">
          <span className="ns-metric-label">Debris Density</span>
          <span className="ns-metric-value sm">{summary.debrisDensity}</span>
        </div>
      </div>

      {/* Detected Classes */}
      <div className="ns-detections-section">
        <h4 className="ns-section-subtitle">Detected Classes</h4>
        <div className="ns-detections-list">
          {detections.map((det) => (
            <div key={det.id} className="ns-detection-item">
              <div className="ns-detection-info">
                <span
                  className="ns-class-indicator"
                  style={{ backgroundColor: det.color }}
                ></span>
                <span className="ns-class-name">{det.label}</span>
              </div>
              <div className="ns-confidence-badge" style={{ color: det.color, backgroundColor: det.bgColor }}>
                {(det.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
