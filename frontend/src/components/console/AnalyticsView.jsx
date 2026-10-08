import React from 'react';
import {
  BarChart3,
  Layers,
  TrendingUp,
  Activity,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import PageHeader from '../common/PageHeader';
import MetricCard from '../common/MetricCard';
import EmptyState from '../common/EmptyState';
import APP_CONFIG from '../../config/appConfig';

export default function AnalyticsView({ onNavigate }) {
  const { history } = useAnalysis();

  const totalSurveys = history.length;
  const imageSurveys = history.filter((h) => h.type === 'image').length;
  const videoSurveys = history.filter((h) => h.type === 'video').length;

  const allDetections = history.flatMap((h) => h.detections || []);
  const totalDetections = allDetections.length;

  // Aggregate category counts from session history
  const categoryCounts = allDetections.reduce((acc, d) => {
    const cls = d.class || 'plastic';
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {});

  // Mean confidence across all detections
  const meanConf = totalDetections
    ? (
        allDetections.reduce((sum, d) => sum + (d.confidence || 0), 0) /
        totalDetections
      ).toFixed(1)
    : 0;

  return (
    <div className="ns-workbench-stage">
      <PageHeader
        title="Analytics & Telemetry"
        subtitle="Aggregate benthic litter statistics, taxonomic distributions, and session audit metrics."
        badge="Session Telemetry"
      />

      {/* Section 1: Session Survey Telemetry */}
      <div className="ns-section-header" style={{ marginBottom: 12 }}>
        <h3 className="ns-section-title">Current Session Telemetry (Workflow Logs)</h3>
        <span className="ns-section-sub">Real-time statistics recorded during the active session</span>
      </div>

      {totalSurveys === 0 ? (
        <div className="ns-stage-card" style={{ padding: '40px 24px' }}>
          <EmptyState
            icon={BarChart3}
            title="No survey activity logged in this session"
            description="Process an underwater image or video detection to populate taxonomic distributions and session metrics."
            actionText="Run First Image Analysis"
            onAction={() => onNavigate('image-detection')}
          />
        </div>
      ) : (
        <>
          {/* Top 4 Session Metrics */}
          <div className="ns-dash-stats-grid">
            <MetricCard
              title="Surveys in Session"
              value={totalSurveys}
              subtitle={`${imageSurveys} image${imageSurveys === 1 ? '' : 's'}, ${videoSurveys} video${videoSurveys === 1 ? '' : 's'}`}
              icon={Activity}
              badge="Session Data"
            />

            <MetricCard
              title="Segmented Debris Targets"
              value={totalDetections}
              subtitle="Across all logged session surveys"
              icon={Layers}
              badge="Targets"
            />

            <MetricCard
              title="Session Mean Confidence"
              value={`${meanConf}%`}
              subtitle="Average detection score"
              icon={CheckCircle2}
            />

            <MetricCard
              title="Avg Targets per Survey"
              value={(totalDetections / totalSurveys).toFixed(1)}
              subtitle="Survey density average"
              icon={TrendingUp}
            />
          </div>

          {/* Taxonomic Distribution Chart */}
          <div className="ns-dash-split-grid" style={{ marginTop: 20 }}>
            {/* Left: Taxonomic Category Distribution */}
            <div className="ns-dash-card">
              <div className="ns-dash-card-header">
                <h3 className="ns-dash-card-title">Session Taxonomic Distribution</h3>
                <span className="ns-dash-badge">Logged Debris</span>
              </div>

              <div className="ns-card-body">
                {Object.keys(categoryCounts).length === 0 ? (
                  <p className="ns-hint-muted">No categorized objects recorded in history.</p>
                ) : (
                  <div className="ns-breakdown-bars-container">
                    {Object.entries(categoryCounts).map(([clsName, count]) => {
                      const tax = APP_CONFIG.TAXONOMY[clsName] || APP_CONFIG.TAXONOMY.other;
                      const pct = totalDetections
                        ? Math.round((count / totalDetections) * 100)
                        : 0;
                      return (
                        <div key={clsName} className="ns-breakdown-item">
                          <div className="ns-breakdown-info">
                            <span className="ns-breakdown-class-name">
                              <span className="ns-chip-dot" style={{ backgroundColor: tax.color }} />
                              {tax.label}
                            </span>
                            <span className="ns-breakdown-count">
                              {count} item{count === 1 ? '' : 's'} ({pct}%)
                            </span>
                          </div>

                          <div className="ns-breakdown-track">
                            <div
                              className="ns-breakdown-fill"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: tax.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Modality Breakdown */}
            <div className="ns-dash-card">
              <div className="ns-dash-card-header">
                <h3 className="ns-dash-card-title">Survey Modality & Activity</h3>
                <span className="ns-dash-badge">Session Audit</span>
              </div>

              <div className="ns-card-body">
                <div className="ns-modality-stats-grid">
                  <div className="ns-modality-box">
                    <div className="ns-modality-icon">
                      <ImageIcon size={20} />
                    </div>
                    <div className="ns-modality-data">
                      <span className="ns-modality-val">{imageSurveys}</span>
                      <span className="ns-modality-lbl">Still Images Analyzed</span>
                    </div>
                  </div>

                  <div className="ns-modality-box">
                    <div className="ns-modality-icon">
                      <Video size={20} />
                    </div>
                    <div className="ns-modality-data">
                      <span className="ns-modality-val">{videoSurveys}</span>
                      <span className="ns-modality-lbl">Video Transects Analyzed</span>
                    </div>
                  </div>
                </div>

                <div className="ns-info-card" style={{ marginTop: 16 }}>
                  <div className="ns-info-card-header">
                    <Info size={14} />
                    <span>Scientific Note</span>
                  </div>
                  <p className="ns-info-card-body">
                    Session telemetry logs are cached in local browser storage so completed
                    surveys stay available for review throughout the session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
