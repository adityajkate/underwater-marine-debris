import React from 'react';
import {
  Clock,
  Trash2,
  ArrowRight,
  Download,
  Image as ImageIcon,
  Video,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import PageHeader from '../common/PageHeader';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import APP_CONFIG from '../../config/appConfig';

export default function HistoryView({ onNavigate }) {
  const { history, deleteHistoryItem, clearHistory, setCurrentAnalysis } = useAnalysis();

  const handleReexamine = (item) => {
    setCurrentAnalysis(item);
    if (item.type === 'video') {
      onNavigate('video-detection');
    } else {
      onNavigate('image-detection');
    }
  };

  const handleExportItem = (item) => {
    const dataBlob = new Blob([JSON.stringify(item, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-${item.filename || 'telemetry'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    if (history.length === 0) return;
    const dataBlob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nirmalsagar-full-session-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ns-history-root">
      <PageHeader
        title="Analysis History"
        subtitle="Chronological audit log of all processed underwater images, video transects, and detected debris."
        badge={`${history.length} Record${history.length === 1 ? '' : 's'}`}
      >
        {history.length > 0 && (
          <div className="ns-header-btn-group">
            <button
              onClick={handleExportAll}
              className="ns-btn-secondary"
              title="Download entire history as JSON"
            >
              <Download size={14} />
              Export All Logs
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history records?')) {
                  clearHistory();
                }
              }}
              className="ns-btn-danger"
              title="Delete all history"
            >
              <Trash2 size={14} />
              Clear History
            </button>
          </div>
        )}
      </PageHeader>

      <div className="ns-history-card">
        {history.length === 0 ? (
          <div style={{ padding: '48px 24px' }}>
            <EmptyState
              icon={Clock}
              title="No analyses yet"
              description="Upload an image or video to begin analysis. Completed runs will automatically be archived here."
              actionText="Start Image Detection"
              onAction={() => onNavigate('image-detection')}
            />
          </div>
        ) : (
          <div className="ns-history-table-container">
            <table className="ns-history-table">
              <thead>
                <tr>
                  <th>Survey Preview & File</th>
                  <th>Modality & Status</th>
                  <th>Date & Time</th>
                  <th>Detections</th>
                  <th>Debris Categories</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ns-history-item-thumb-box">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.filename}
                            className="ns-history-thumb"
                          />
                        ) : (
                          <div className="ns-history-thumb-placeholder">
                            {item.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                          </div>
                        )}
                        <div>
                          <div className="ns-history-item-title">{item.filename}</div>
                          {item.durationMs && (
                            <span className="ns-history-subtext">
                              {item.durationMs}ms inference
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="ns-modality-pill">
                          {item.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                          {item.type === 'video' ? 'Video' : 'Image'}
                        </span>
                        <span className="ns-badge-real-subtle">
                          {item.status || 'Completed'}
                        </span>
                      </div>
                    </td>

                    <td className="ns-history-date">{item.displayDate || item.timestamp}</td>

                    <td>
                      <span className="ns-history-count-badge">
                        {item.numDetections} {item.numDetections === 1 ? 'target' : 'targets'}
                      </span>
                    </td>

                    <td>
                      <div className="ns-table-tags-group">
                        {Object.keys(item.classBreakdown || {}).length > 0 ? (
                          Object.keys(item.classBreakdown).map((cls) => {
                            const tax = APP_CONFIG.TAXONOMY[cls] || APP_CONFIG.TAXONOMY.other;
                            return (
                              <span
                                key={cls}
                                className="ns-mini-tag"
                                style={{
                                  backgroundColor: tax.bgTint,
                                  color: tax.color,
                                  borderColor: tax.color,
                                }}
                              >
                                {tax.shortLabel || cls}
                              </span>
                            );
                          })
                        ) : (
                          <span className="ns-hint-muted">—</span>
                        )}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="ns-history-row-actions">
                        <button
                          onClick={() => handleReexamine(item)}
                          className="ns-history-action-btn"
                          title="Inspect detections"
                        >
                          Inspect
                          <ArrowRight size={13} />
                        </button>

                        <button
                          onClick={() => handleExportItem(item)}
                          className="ns-icon-btn-subtle"
                          title="Download record JSON"
                          aria-label="Download record"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="ns-icon-btn-subtle ns-btn-delete"
                          title="Delete from history"
                          aria-label="Delete item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
