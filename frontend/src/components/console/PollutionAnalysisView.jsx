import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  Download,
  Layers,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  LifeBuoy,
  ChevronRight,
  Fish,
  Anchor,
  Activity,
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { calculatePollutionAssessment } from '../../services/inferenceService';
import PageHeader from '../common/PageHeader';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import APP_CONFIG from '../../config/appConfig';

export default function PollutionAnalysisView({ onNavigate }) {
  const { currentAnalysis, history } = useAnalysis();

  // Use active current analysis, or fallback to most recent survey in session history
  const activeAnalysis = currentAnalysis || (history.length > 0 ? history[0] : null);

  if (!activeAnalysis) {
    return (
      <div className="ns-workbench-stage">
        <PageHeader
          title="Pollution Analysis"
          subtitle="Taxonomic debris categorization, ecological threat profiling, and benthic pollution assessment."
          badge="Environmental Assessment"
        />

        <div className="ns-stage-card" style={{ padding: '48px 24px' }}>
          <EmptyState
            icon={ShieldAlert}
            title="No survey analysis loaded"
            description="Run an image or video detection first to evaluate marine litter density and ecological hazard classification."
            actionText="Go to Image Detection"
            onAction={() => onNavigate('image-detection')}
          />
        </div>
      </div>
    );
  }

  // Calculate assessment using central service calculation
  const assessment = calculatePollutionAssessment(activeAnalysis);

  const handleExportReport = () => {
    if (!assessment) return;

    const report = {
      reportType: 'NirmalSagar Environmental Pollution Assessment',
      isDemo: assessment.isDemo,
      generatedAt: new Date().toISOString(),
      surveyFilename: assessment.surveyFilename,
      numDetections: assessment.numDetections,
      dominantCategory: assessment.dominantLabel,
      densityAssessment: assessment.densityCategory,
      materialCounts: assessment.counts,
      ecologicalThreats: assessment.threatFactors,
      remediationPlan: assessment.recommendations,
      methodologyNotice:
        'Qualitative benthic litter classification derived from the detected debris taxonomy. Density figures are relative to detected item counts pending transect surface-area calibration.',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nirmalsagar-pollution-assessment-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ns-workbench-stage">
      <PageHeader
        title="Pollution Analysis"
        subtitle="Taxonomic debris categorization, ecological threat profiling, and benthic pollution assessment."
        badge="Environmental Assessment"
      >
        <button onClick={handleExportReport} className="ns-btn-secondary ns-btn-sm">
          <Download size={14} />
          Export Assessment Report
        </button>
      </PageHeader>

      {/* Survey Info Banner */}
      <div className="ns-survey-meta-banner">
        <div className="ns-meta-banner-left">
          <FileText size={15} />
          <span>Active Survey: <strong>{assessment.surveyFilename}</strong></span>
          <span className="ns-dot-sep">•</span>
          <Clock size={13} />
          <span>{assessment.timestamp}</span>
        </div>
        <StatusBadge status="completed" text="Assessment Ready" size="sm" />
      </div>

      {/* Metrics Overview */}
      <div className="ns-dash-stats-grid">
        <MetricCard
          title="Detected Debris Items"
          value={assessment.numDetections}
          subtitle="Total items detected in survey"
          icon={Layers}
          badge="Count"
        />

        <MetricCard
          title="Dominant Category"
          value={assessment.dominantLabel}
          subtitle={
            assessment.numDetections > 0
              ? `${assessment.counts[assessment.dominantClass] || 0} of ${assessment.numDetections} detected items`
              : 'No dominant class'
          }
          icon={AlertTriangle}
        />

        <MetricCard
          title="Accumulation Level"
          value={assessment.densityCategory}
          subtitle="Relative debris concentration"
          icon={ShieldAlert}
        />

        <MetricCard
          title="Ecological Risk"
          value={
            assessment.counts.gear > 0
              ? 'Critical (Ghost Gear)'
              : assessment.counts.plastic >= 3
              ? 'High (Microplastics)'
              : assessment.numDetections > 0
              ? 'Moderate'
              : 'Low / Clean'
          }
          subtitle="Benthic threat profile"
          icon={Activity}
        />
      </div>

      {/* Split Grid: Left Material Breakdown, Right Threat Profiling & Recommendations */}
      <div className="ns-dash-split-grid">
        {/* Left: Material Composition Breakdown */}
        <div className="ns-dash-card">
          <div className="ns-dash-card-header">
            <h3 className="ns-dash-card-title">Material Taxonomy Distribution</h3>
            <span className="ns-dash-badge">Detected Items</span>
          </div>

          <div className="ns-card-body">
            <div className="ns-tax-breakdown-list">
              {Object.entries(assessment.counts).map(([clsKey, count]) => {
                const tax = APP_CONFIG.TAXONOMY[clsKey] || APP_CONFIG.TAXONOMY.other;
                const percentage = assessment.numDetections
                  ? Math.round((count / assessment.numDetections) * 100)
                  : 0;

                return (
                  <div key={clsKey} className="ns-tax-item">
                    <div className="ns-tax-item-header">
                      <div className="ns-tax-item-name">
                        <span className="ns-chip-dot" style={{ backgroundColor: tax.color }} />
                        <span className="ns-tax-name-text">{tax.label}</span>
                      </div>
                      <span className="ns-tax-item-count">
                        {count} item{count === 1 ? '' : 's'} ({percentage}%)
                      </span>
                    </div>

                    <div className="ns-tax-bar-bg">
                      <div
                        className="ns-tax-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: tax.color,
                        }}
                      />
                    </div>
                    <span className="ns-tax-item-desc">{tax.threatDescription}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Ecological Hazard Evaluation & Recommendations */}
        <div className="ns-dash-card">
          <div className="ns-dash-card-header">
            <h3 className="ns-dash-card-title">Ecological Risk & Remediation</h3>
            <span className="ns-dash-badge">Threat Profile</span>
          </div>

          <div className="ns-card-body">
            {assessment.threatFactors.length === 0 ? (
              <p className="ns-hint-muted">No high-risk environmental hazards identified in this survey.</p>
            ) : (
              <div className="ns-threat-factors-list">
                <h4 className="ns-sub-heading" style={{ marginBottom: 6 }}>
                  Identified Ecological Hazards:
                </h4>
                {assessment.threatFactors.map((tf, i) => (
                  <div key={i} className={`ns-threat-factor-box threat-box-${tf.level.toLowerCase()}`}>
                    <div className="ns-threat-box-top">
                      <span className="ns-threat-box-title">{tf.threat}</span>
                      <span className={`ns-threat-tag threat-${tf.level.toLowerCase()}`}>
                        {tf.level} Risk
                      </span>
                    </div>
                    <p className="ns-threat-box-desc">{tf.description}</p>
                  </div>
                ))}
              </div>
            )}

            {assessment.recommendations.length > 0 && (
              <div className="ns-remediation-section" style={{ marginTop: 16 }}>
                <h4 className="ns-sub-heading" style={{ marginBottom: 6 }}>
                  Recommended Action Plan:
                </h4>
                <div className="ns-remediation-list">
                  {assessment.recommendations.map((rec, i) => (
                    <div key={i} className="ns-remediation-item">
                      <div className="ns-remediation-top">
                        <span className="ns-remediation-action">{rec.action}</span>
                        <span className="ns-remediation-urgency">{rec.urgency}</span>
                      </div>
                      <p className="ns-remediation-detail">{rec.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
