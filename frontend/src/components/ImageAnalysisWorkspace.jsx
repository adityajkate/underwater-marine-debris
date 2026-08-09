import React, { useState, useRef } from 'react';
import { analyzeUnderwaterImage } from '../services/mockDetectionService';
import AnalysisResultsPanel from './AnalysisResultsPanel';

export default function ImageAnalysisWorkspace() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const fileInputRef = useRef(null);

  // Handle file picker selection
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
      alert('Please upload a valid image file (JPG, JPEG, or PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setAnalysisResults(null); // Reset previous analysis when new image loaded
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Run analysis
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const results = await analyzeUnderwaterImage(selectedImage);
      setAnalysisResults(results);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="ns-workspace-layout">
      {/* Central Main Workspace Area */}
      <div className="ns-main-area">
        {/* Workspace Title Header */}
        <div className="ns-page-header">
          <div>
            <h1 className="ns-page-title">Image Analysis</h1>
            <p className="ns-page-subtitle">Upload underwater imagery for AI debris detection.</p>
          </div>
          <button type="button" className="ns-history-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            History
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Upload Container / Preview Canvas Card */}
        <div className="ns-card ns-upload-card">
          {!selectedImage ? (
            /* INITIAL STATE: Upload Dropzone */
            <div
              className={`ns-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="ns-upload-icon-wrapper">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2c6863" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  <path d="M12 13v6" />
                  <path d="m9 16 3-3 3 3" />
                </svg>
              </div>
              <h2 className="ns-dropzone-title">Upload Underwater Image</h2>
              <p className="ns-dropzone-desc">Drag and drop or click to upload</p>
              
              <div className="ns-dropzone-actions">
                <button
                  type="button"
                  className="ns-btn ns-btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </button>

                <button
                  type="button"
                  className="ns-btn ns-btn-primary"
                  disabled={!selectedImage}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Analyze Image
                </button>
              </div>
            </div>
          ) : (
            /* IMAGE SELECTED OR ANALYZED STATE */
            <div className="ns-preview-workspace">
              <div className="ns-canvas-container">
                <img
                  src={selectedImage}
                  alt="Underwater Target"
                  className="ns-preview-img"
                />

                {/* YOLO11-seg SVG Overlay (Displayed when analysis results exist) */}
                {analysisResults && analysisResults.detections && (
                  <svg
                    className="ns-detection-overlay"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {analysisResults.detections.map((det) => (
                      <g key={det.id} className="ns-detection-group">
                        {/* Instance Segmentation Mask Polygon */}
                        {det.polygon && (
                          <polygon
                            points={det.polygon}
                            fill={det.bgColor}
                            stroke={det.color}
                            strokeWidth="0.8"
                            strokeDasharray="1.5,1.5"
                          />
                        )}
                        {/* Bounding Box */}
                        <rect
                          x={det.bbox.x}
                          y={det.bbox.y}
                          width={det.bbox.width}
                          height={det.bbox.height}
                          fill="none"
                          stroke={det.color}
                          strokeWidth="1.2"
                          rx="1"
                        />
                        {/* Label Tag Box */}
                        <rect
                          x={det.bbox.x}
                          y={Math.max(0, det.bbox.y - 4.5)}
                          width={Math.min(35, det.label.length * 1.5 + 8)}
                          height="4.2"
                          fill={det.color}
                          rx="0.8"
                        />
                        {/* Label Tag Text */}
                        <text
                          x={det.bbox.x + 1}
                          y={Math.max(3.1, det.bbox.y - 1.2)}
                          fill="#ffffff"
                          fontSize="2.8"
                          fontWeight="700"
                          fontFamily="sans-serif"
                        >
                          {det.label} {(det.confidence * 100).toFixed(0)}%
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>

              {/* Action Toolbar Below Canvas */}
              <div className="ns-canvas-actions">
                <button
                  type="button"
                  className="ns-btn ns-btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </button>

                <button
                  type="button"
                  className="ns-btn ns-btn-primary"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="ns-btn-spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {analysisResults ? 'Analyze Again' : 'Analyze Image'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Analysis Panel */}
      <AnalysisResultsPanel
        results={analysisResults}
        isAnalyzing={isAnalyzing}
        hasImage={!!selectedImage}
      />
    </div>
  );
}
