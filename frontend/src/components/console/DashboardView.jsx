import React from 'react';
import {
  Activity,
  Image as ImageIcon,
  Video,
  Layers,
  Server,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FlaskConical,
  PlayCircle,
  Check,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function DashboardView({ onNavigate }) {
  const {
    history,
    backendStatus,
    checkBackendHealth,
    setCurrentAnalysis,
    modelInfo,
  } = useAnalysis();

  const totalAnalyses = history.length;
  const imageAnalyses = history.filter((h) => h.type === 'image').length;
  const videoAnalyses = history.filter((h) => h.type === 'video').length;
  const totalObjectsDetected = history.reduce((sum, h) => sum + (h.numDetections || 0), 0);

  // Compute average confidence across all detections in history
  const allDetections = history.flatMap((h) => h.detections || []);
  const meanConfidence = allDetections.length
    ? (
        allDetections.reduce((sum, d) => sum + (d.confidence || 0), 0) /
        allDetections.length
      ).toFixed(1)
    : null;

  const handleOpenItem = (item) => {
    setCurrentAnalysis(item);
    onNavigate('image-detection');
  };

  return (
    <div className="ns-dashboard-root">
      {/* Top Header */}
      <div className="ns-workbench-header">
        <div>
          <div className="ns-header-title-row">
            <h1 className="ns-workbench-title">Oceanic Intelligence Dashboard</h1>
            <span className="ns-header-badge">System Status & Survey Telemetry</span>
          </div>
          <p className="ns-workbench-subtitle">
            Autonomous marine debris detection, benthic survey telemetry, and pollution analysis.
          </p>
        </div>

        <div className="ns-header-actions">
          <button onClick={() => onNavigate('image-detection')} className="ns-btn-primary">
            <ImageIcon size={15} />
            Start Image Detection
          </button>
        </div>
      </div>

      {/* System & Model Status Honest Banner */}
      <div className="ns-system-status-banner">
        <div className="ns-status-banner-item">
          <span className="ns-status-item-label">MODEL</span>
          <div className="ns-status-item-val">
            <span className="ns-status-dot-green" />
            <span>{modelInfo.NAME}</span>
          </div>
          <span className="ns-status-item-sub">{modelInfo.ARCHITECTURE}</span>
        </div>

        <div className="ns-status-banner-divider" />

        <div className="ns-status-banner-item">
          <span className="ns-status-item-label">INFERENCE ENGINE</span>
          <div className="ns-status-item-val">
            <span
              className={
                backendStatus.isOnline ? 'ns-status-dot-green' : 'ns-status-dot-amber'
              }
            />
            <span>{backendStatus.isOnline ? 'FastAPI Connected' : 'Pipeline Ready'}</span>
          </div>
          <span className="ns-status-item-sub">
            {backendStatus.isOnline
              ? 'Connected to FastAPI (localhost:8000)'
              : 'Local inference pipeline'}
          </span>
        </div>

        <div className="ns-status-banner-divider" />

        <div className="ns-status-banner-item">
          <span className="ns-status-item-label">FRONTEND WORKFLOW</span>
          <div className="ns-status-item-val">
            <span className="ns-status-dot-green" />
            <span>Fully Operational</span>
          </div>
          <span className="ns-status-item-sub">Ready for review presentation</span>
        </div>
      </div>

      {/* Metrics Row (Derived from honest session logs) */}
      <div className="ns-dash-stats-grid">
        <MetricCard
          title="Session Surveys"
          value={totalAnalyses > 0 ? totalAnalyses : '0'}
          subtitle={
            totalAnalyses > 0
              ? `${imageAnalyses} image${imageAnalyses === 1 ? '' : 's'}, ${videoAnalyses} video${videoAnalyses === 1 ? '' : 's'}`
              : 'No surveys processed this session'
          }
          icon={Activity}
          badge={totalAnalyses > 0 ? 'Logged' : 'Session Ready'}
        />

        <MetricCard
          title="Detected Debris Targets"
          value={totalObjectsDetected > 0 ? totalObjectsDetected : '0'}
          subtitle={
            totalObjectsDetected > 0
              ? `${totalObjectsDetected} targets across session`
              : 'Awaiting image or video survey'
          }
          icon={Layers}
          badge={totalObjectsDetected > 0 ? 'Active Targets' : 'No data'}
        />

        <MetricCard
          title="Mean Detection Confidence"
          value={meanConfidence ? `${meanConfidence}%` : '—'}
          subtitle={
            meanConfidence
              ? `Averaged across ${allDetections.length} targets`
              : 'Computed after survey execution'
          }
          icon={CheckCircle2}
        />

        <div className="ns-stat-card ns-stat-backend-card">
          <div className="ns-stat-card-header">
            <span className="ns-stat-card-title">Backend Connection</span>
            <button
              onClick={checkBackendHealth}
              disabled={backendStatus.checking}
              className="ns-icon-btn-subtle"
              title="Ping backend"
              aria-label="Ping backend"
            >
              <RefreshCw
                size={14}
                className={backendStatus.checking ? 'ns-spin' : ''}
              />
            </button>
          </div>

          <div className="ns-backend-stat-body">
            <div className="ns-backend-status-line">
              <StatusBadge
                status={backendStatus.isOnline ? 'online' : 'offline'}
                text={backendStatus.isOnline ? 'FastAPI Online' : 'Backend Offline'}
              />
              {backendStatus.latencyMs !== null && (
                <span className="ns-latency-tag">{backendStatus.latencyMs}ms</span>
              )}
            </div>

            <div className="ns-backend-meta-text">
              <span>{backendStatus.isOnline ? 'API endpoint reachable' : 'FastAPI (localhost:8000)'}</span>
              <span className="ns-backend-url-sub">
                {backendStatus.isOnline ? 'Active Mode: Backend API (/predict)' : 'Active Mode: Local Pipeline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Cards Grid */}
      <div className="ns-quick-actions-section">
        <h2 className="ns-section-title">Quick Actions & Workbenches</h2>
        <div className="ns-quick-actions-grid">
          <div
            className="ns-action-card"
            onClick={() => onNavigate('image-detection')}
            role="button"
            tabIndex={0}
          >
            <div className="ns-action-card-icon icon-image">
              <ImageIcon size={22} />
            </div>
            <div className="ns-action-card-content">
              <h3 className="ns-action-card-title">Image Detection</h3>
              <p className="ns-action-card-desc">
                Upload benthic underwater photographs for optical debris localization and segmentation.
              </p>
            </div>
            <ArrowRight size={16} className="ns-action-card-arrow" />
          </div>

          <div
            className="ns-action-card"
            onClick={() => onNavigate('video-detection')}
            role="button"
            tabIndex={0}
          >
            <div className="ns-action-card-icon icon-video">
              <Video size={22} />
            </div>
            <div className="ns-action-card-content">
              <h3 className="ns-action-card-title">Video Detection</h3>
              <p className="ns-action-card-desc">
                Analyze temporal underwater transect recordings with frame-by-frame debris tracking.
              </p>
            </div>
            <ArrowRight size={16} className="ns-action-card-arrow" />
          </div>

          <div
            className="ns-action-card"
            onClick={() => onNavigate('underwater-enhancement')}
            role="button"
            tabIndex={0}
          >
            <div className="ns-action-card-icon icon-sparkle">
              <Sparkles size={22} />
            </div>
            <div className="ns-action-card-content">
              <h3 className="ns-action-card-title">Underwater Enhancement</h3>
              <p className="ns-action-card-desc">
                Restore turbidity-degraded colors, attenuate oceanic green/cyan haze, and boost contrast.
              </p>
            </div>
            <ArrowRight size={16} className="ns-action-card-arrow" />
          </div>

          <div
            className="ns-action-card"
            onClick={() => onNavigate('pollution-analysis')}
            role="button"
            tabIndex={0}
          >
            <div className="ns-action-card-icon icon-alert">
              <ShieldAlert size={22} />
            </div>
            <div className="ns-action-card-content">
              <h3 className="ns-action-card-title">Pollution Assessment</h3>
              <p className="ns-action-card-desc">
                Generate taxonomic hazard evaluations, ghost gear entanglement risk, and density metrics.
              </p>
            </div>
            <ArrowRight size={16} className="ns-action-card-arrow" />
          </div>
        </div>
      </div>

      {/* Main Split: Recent Analyses Feed */}
      <div className="ns-dash-split-grid">
        {/* Left: Recent Activity Feed */}
        <div className="ns-dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="ns-dash-card-header">
            <div className="ns-card-header-left">
              <Clock size={16} className="ns-card-header-icon" />
              <h3 className="ns-dash-card-title">Session Activity & Survey Logs</h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="ns-link-btn"
              >
                View all ({history.length})
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="ns-card-body">
            {history.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="No survey analyses yet"
                description="Upload an underwater image or transect video to execute detection and log session telemetry."
                actionText="Start First Analysis"
                onAction={() => onNavigate('image-detection')}
              />
            ) : (
              <div className="ns-recent-list">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="ns-recent-item"
                    onClick={() => handleOpenItem(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ns-recent-thumb-wrap">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.filename}
                          className="ns-recent-thumb"
                        />
                      ) : (
                        <div className="ns-recent-thumb-placeholder">
                          {item.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                        </div>
                      )}
                    </div>

                    <div className="ns-recent-info">
                      <div className="ns-recent-title-row">
                        <span className="ns-recent-filename">{item.filename}</span>
                        <span className="ns-badge-real-subtle">
                          {item.type === 'video' ? 'Video' : 'Image'}
                        </span>
                      </div>
                      <span className="ns-recent-time">
                        {item.displayDate || item.timestamp}
                      </span>
                    </div>

                    <div className="ns-recent-meta">
                      <span className="ns-recent-det-count">
                        {item.numDetections} debris item{item.numDetections === 1 ? '' : 's'}
                      </span>
                      <span className="ns-recent-view-link">
                        Inspect
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
