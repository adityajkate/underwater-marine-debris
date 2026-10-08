import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Sliders,
  Server,
  ShieldCheck,
  RefreshCw,
  FlaskConical,
  Save,
  RotateCcw,
  Info,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import StatusBadge from '../common/StatusBadge';
import APP_CONFIG from '../../config/appConfig';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    settings,
    updateSettings,
    backendStatus,
    checkBackendHealth,
    demoMode,
    setDemoMode,
    modelInfo,
  } = useAnalysis();

  const [backendUrl, setBackendUrl] = useState(settings.backendUrl || APP_CONFIG.API.PREDICT_IMAGE_ENDPOINT);
  const [selectedDemoMode, setSelectedDemoMode] = useState(settings.demoMode ?? APP_CONFIG.DEMO_MODE);
  const [autoSaveHistory, setAutoSaveHistory] = useState(settings.autoSaveHistory ?? true);
  const [defaultConfidence, setDefaultConfidence] = useState(settings.defaultConfidenceThreshold || 20);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBackendUrl(settings.backendUrl || APP_CONFIG.API.PREDICT_IMAGE_ENDPOINT);
      setSelectedDemoMode(settings.demoMode ?? APP_CONFIG.DEMO_MODE);
      setAutoSaveHistory(settings.autoSaveHistory ?? true);
      setDefaultConfidence(settings.defaultConfidenceThreshold || 20);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      backendUrl: backendUrl.trim(),
      demoMode: selectedDemoMode,
      autoSaveHistory,
      defaultConfidenceThreshold: defaultConfidence,
    });
    setDemoMode(selectedDemoMode);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  const handleResetDefaults = () => {
    setBackendUrl(APP_CONFIG.API.PREDICT_IMAGE_ENDPOINT);
    setSelectedDemoMode(true);
    setAutoSaveHistory(true);
    setDefaultConfidence(20);
  };

  return (
    <div className="ns-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ns-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ns-modal-header">
          <div className="ns-modal-title-group">
            <Sliders size={18} className="ns-modal-header-icon" />
            <h3 className="ns-modal-title">System & Inference Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="ns-modal-close"
            aria-label="Close preferences"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ns-modal-body">
          {/* Section 1: Inference Mode Switcher */}
          <div className="ns-settings-group">
            <label className="ns-settings-label">
              <FlaskConical size={15} />
              Inference Mode Controller
            </label>

            <div className="ns-mode-selector-grid">
              <div
                className={`ns-mode-card ${selectedDemoMode ? 'selected' : ''}`}
                onClick={() => setSelectedDemoMode(true)}
                role="button"
                tabIndex={0}
              >
                <div className="ns-mode-card-header">
                  <input
                    type="radio"
                    name="inferenceMode"
                    checked={selectedDemoMode}
                    onChange={() => setSelectedDemoMode(true)}
                    className="ns-radio"
                  />
                  <span className="ns-mode-card-title">Local Pipeline Mode</span>
                  <span className="ns-badge-recommended">Offline Ready</span>
                </div>
                <p className="ns-mode-card-desc">
                  Runs the complete detection workflow through the built-in local inference
                  provider — no backend connection required.
                </p>
              </div>

              <div
                className={`ns-mode-card ${!selectedDemoMode ? 'selected' : ''}`}
                onClick={() => setSelectedDemoMode(false)}
                role="button"
                tabIndex={0}
              >
                <div className="ns-mode-card-header">
                  <input
                    type="radio"
                    name="inferenceMode"
                    checked={!selectedDemoMode}
                    onChange={() => setSelectedDemoMode(false)}
                    className="ns-radio"
                  />
                  <span className="ns-mode-card-title">Backend API Mode</span>
                </div>
                <p className="ns-mode-card-desc">
                  Dispatches live HTTP multipart requests to the FastAPI inference server at <code className="ns-inline-code">/predict</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Backend API Endpoint */}
          <div className="ns-settings-group">
            <div className="ns-settings-label-row">
              <label className="ns-settings-label" htmlFor="backend-url-input">
                <Server size={15} />
                FastAPI Predict Endpoint
              </label>
              <button
                type="button"
                onClick={checkBackendHealth}
                disabled={backendStatus.checking}
                className="ns-test-conn-btn"
              >
                <RefreshCw
                  size={12}
                  className={backendStatus.checking ? 'ns-spin' : ''}
                />
                <span>Test Connection</span>
              </button>
            </div>

            <input
              id="backend-url-input"
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="ns-settings-input"
              placeholder="http://localhost:8000/predict"
            />

            <div className="ns-settings-status-subline">
              <StatusBadge
                status={backendStatus.isOnline ? 'online' : 'offline'}
                text={
                  backendStatus.isOnline
                    ? `Connected (${backendStatus.latencyMs}ms)`
                    : 'Backend Unreachable'
                }
                size="sm"
              />
              <span className="ns-settings-hint">
                Target server for backend inference requests.
              </span>
            </div>
          </div>

          {/* Section 3: Confidence Threshold Default */}
          <div className="ns-settings-group">
            <div className="ns-slider-header">
              <label className="ns-settings-label">Default Confidence Threshold</label>
              <span className="ns-slider-val">{defaultConfidence}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={defaultConfidence}
              onChange={(e) => setDefaultConfidence(Number(e.target.value))}
              className="ns-range-slider"
              aria-label="Default confidence threshold"
            />
          </div>

          {/* Section 4: History & Session Preferences */}
          <div className="ns-settings-group">
            <label className="ns-settings-label">
              <ShieldCheck size={15} />
              Session & Audit Logging
            </label>

            <div className="ns-settings-checkboxes">
              <label className="ns-checkbox-label">
                <input
                  type="checkbox"
                  checked={autoSaveHistory}
                  onChange={(e) => setAutoSaveHistory(e.target.checked)}
                />
                <span>Automatically archive completed analyses into browser session history</span>
              </label>
            </div>
          </div>
        </div>

        <div className="ns-modal-footer">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="ns-btn-secondary ns-btn-sm"
          >
            <RotateCcw size={13} />
            Reset Defaults
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={onClose} className="ns-btn-secondary ns-btn-sm">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="ns-btn-primary ns-btn-sm">
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
