import React from 'react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    id: 'images',
    label: 'Images Analyzed',
    value: '128',
    sub: '+12% this month',
    subPositive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'debris',
    label: 'Debris Detected',
    value: '1,284',
    sub: 'Across analyzed imagery',
    subPositive: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <line x1="6" y1="8" x2="6" y2="16" />
        <line x1="18" y1="8" x2="18" y2="16" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="18" x2="16" y2="18" />
      </svg>
    ),
  },
  {
    id: 'types',
    label: 'Debris Types',
    value: '6',
    sub: 'Detected categories',
    subPositive: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'density',
    label: 'Avg. Density',
    value: '0.42',
    valueUnit: ' obj/m²',
    sub: 'Current survey average',
    subPositive: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="10" y="3" width="5" height="5" rx="1" />
        <rect x="17" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="10" width="5" height="5" rx="1" />
        <rect x="10" y="10" width="5" height="5" rx="1" />
        <rect x="17" y="10" width="5" height="5" rx="1" />
        <rect x="3" y="17" width="5" height="5" rx="1" />
        <rect x="10" y="17" width="5" height="5" rx="1" />
        <rect x="17" y="17" width="5" height="5" rx="1" />
      </svg>
    ),
  },
];

// Weekly trend data points (relative units — used to build SVG polyline)
const TREND_POINTS = [
  { week: 'Week 1', val: 18 },
  { week: 'Week 2', val: 28 },
  { week: 'Week 3', val: 36 },
  { week: 'Week 4', val: 52 },
  { week: 'Week 5', val: 68 },
  { week: 'Week 6', val: 58 },
];

const COMPOSITION = [
  { label: 'Plastic Bottle', pct: 35, color: '#0d4844' },
  { label: 'Plastic Bag',    pct: 25, color: '#1a6b65' },
  { label: 'Fishing Net',    pct: 15, color: '#2a9d8f' },
  { label: 'Rope',           pct: 12, color: '#52bdb4' },
  { label: 'Metal',          pct:  8, color: '#7ed8d1' },
  { label: 'Other',          pct:  5, color: '#b2eae6' },
];

// Map pin data (percentage positions within the map card)
const MAP_PINS = [
  { x: 28, y: 48, level: 'high',   label: 'Area A' },
  { x: 47, y: 62, level: 'medium', label: 'Area B' },
  { x: 63, y: 38, level: 'medium', label: 'Area C' },
  { x: 78, y: 55, level: 'low',    label: 'Area D' },
];

const PIN_COLOR = { high: '#0d4844', medium: '#4eb3aa', low: '#9cead8' };

const RECENT_ANALYSES = [
  { id: 'Survey_001', date: '08 Aug 2026', detected: 18, dominantType: 'Plastic Bottle', density: 0.42 },
  { id: 'Survey_002', date: '07 Aug 2026', detected: 11, dominantType: 'Fishing Net',    density: 0.31 },
  { id: 'Survey_003', date: '06 Aug 2026', detected: 27, dominantType: 'Plastic Bag',    density: 0.67 },
];

// ─── Inline SVG Line Chart ─────────────────────────────────────────────────────
function TrendChart() {
  const W = 560;
  const H = 180;
  const PAD = { top: 16, right: 24, bottom: 36, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...TREND_POINTS.map(p => p.val));
  const xs = TREND_POINTS.map((_, i) => PAD.left + (i / (TREND_POINTS.length - 1)) * innerW);
  const ys = TREND_POINTS.map(p => PAD.top + innerH - (p.val / maxVal) * innerH);

  const lineD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaD = `${lineD} L${xs[xs.length - 1]},${PAD.top + innerH} L${xs[0]},${PAD.top + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Area fill */}
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a9d8f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2a9d8f" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#trendFill)" />

      {/* Horizontal guide lines */}
      {[0.25, 0.5, 0.75, 1].map(f => {
        const y = PAD.top + innerH * (1 - f);
        return <line key={f} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#cde6e3" strokeWidth="1" />;
      })}

      {/* Trend line */}
      <path d={lineD} fill="none" stroke="#2a9d8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="5" fill="#fff" stroke="#2a9d8f" strokeWidth="2.5" />
      ))}

      {/* X-axis labels */}
      {TREND_POINTS.map((p, i) => (
        <text key={i} x={xs[i]} y={H - 6} textAnchor="middle" fontSize="11" fill="#5f8682" fontFamily="system-ui,sans-serif">
          {p.week}
        </text>
      ))}
    </svg>
  );
}

// ─── Map Placeholder ──────────────────────────────────────────────────────────
function DensityMap() {
  return (
    <div className="ns-dash-map-container">
      {/* Faint topographic-style SVG background */}
      <svg className="ns-dash-map-svg" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cde6e3" />
            <stop offset="100%" stopColor="#e3f2f0" />
          </linearGradient>
        </defs>
        <rect width="700" height="200" fill="url(#mapBg)" />
        {/* Topo contour curves */}
        <ellipse cx="200" cy="100" rx="160" ry="75" fill="none" stroke="#b2d8d4" strokeWidth="1.5" />
        <ellipse cx="200" cy="100" rx="100" ry="46" fill="none" stroke="#99cec9" strokeWidth="1.5" />
        <ellipse cx="450" cy="110" rx="140" ry="65" fill="none" stroke="#b2d8d4" strokeWidth="1.5" />
        <ellipse cx="450" cy="110" rx="85"  ry="40" fill="none" stroke="#99cec9" strokeWidth="1.5" />
        <ellipse cx="590" cy="70"  rx="80"  ry="50" fill="none" stroke="#c2e0dc" strokeWidth="1.2" />
      </svg>

      {/* Density pins */}
      {MAP_PINS.map((pin, i) => (
        <div
          key={i}
          className="ns-dash-map-pin"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          title={`${pin.label} — ${pin.level} density`}
        >
          <div className="ns-dash-pin-outer" style={{ borderColor: PIN_COLOR[pin.level] }}>
            <div className="ns-dash-pin-inner" style={{ backgroundColor: PIN_COLOR[pin.level] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Component ──────────────────────────────────────────────────────
export default function Dashboard({ onNavigateToAnalysis }) {
  return (
    <div className="ns-dash-page">
      {/* Page Header */}
      <div className="ns-dash-page-header">
        <div>
          <h1 className="ns-dash-title">Dashboard</h1>
          <p className="ns-dash-subtitle">Monitor underwater debris detection, analysis activity, and pollution indicators.</p>
        </div>
        <button type="button" className="ns-dash-period-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
          Last 30 Days
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* ─── Stat Cards Row ────────────────────────────────────────────── */}
      <div className="ns-dash-stat-grid">
        {STAT_CARDS.map(card => (
          <div key={card.id} className="ns-dash-stat-card">
            <div className="ns-dash-stat-header">
              <span className="ns-dash-stat-label">{card.label}</span>
              <div className="ns-dash-stat-icon">{card.icon}</div>
            </div>
            <div className="ns-dash-stat-value">
              {card.value}
              {card.valueUnit && <span className="ns-dash-stat-unit">{card.valueUnit}</span>}
            </div>
            <div className={`ns-dash-stat-sub ${card.subPositive === true ? 'positive' : ''}`}>
              {card.subPositive === true && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              )}
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ────────────────────────────────────────────────── */}
      <div className="ns-dash-charts-row">
        {/* Debris Detection Trends */}
        <div className="ns-dash-card ns-dash-trend-card">
          <div className="ns-dash-card-header">
            <h3 className="ns-dash-card-title">Debris Detection Trends</h3>
            <button type="button" className="ns-dash-more-btn" title="More options">
              <span>•••</span>
            </button>
          </div>
          <div className="ns-dash-trend-chart-area">
            <TrendChart />
          </div>
        </div>

        {/* Debris Composition */}
        <div className="ns-dash-card ns-dash-composition-card">
          <div className="ns-dash-card-header">
            <h3 className="ns-dash-card-title">Debris Composition</h3>
          </div>
          <div className="ns-dash-composition-list">
            {COMPOSITION.map(item => (
              <div key={item.label} className="ns-dash-comp-row">
                <div className="ns-dash-comp-meta">
                  <span className="ns-dash-comp-label">{item.label}</span>
                  <span className="ns-dash-comp-pct">{item.pct}%</span>
                </div>
                <div className="ns-dash-comp-bar-track">
                  <div
                    className="ns-dash-comp-bar-fill"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Map + Table Row ───────────────────────────────────────────── */}
      <div className="ns-dash-bottom-row">
        {/* Debris Density Overview Map */}
        <div className="ns-dash-card ns-dash-map-card">
          <div className="ns-dash-card-header">
            <div>
              <h3 className="ns-dash-card-title">Debris Density Overview</h3>
              <p className="ns-dash-card-subtitle">Estimated pollution density across surveyed underwater areas</p>
            </div>
            <div className="ns-dash-map-legend">
              {['Low', 'Medium', 'High'].map(l => (
                <div key={l} className="ns-dash-legend-item">
                  <span className="ns-dash-legend-dot" style={{ backgroundColor: PIN_COLOR[l.toLowerCase()] }} />
                  <span className="ns-dash-legend-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <DensityMap />
        </div>
      </div>

      {/* ─── Recent Analyses + CTA ─────────────────────────────────────── */}
      <div className="ns-dash-analysis-row">
        {/* Recent Analyses Table */}
        <div className="ns-dash-card ns-dash-table-card">
          <div className="ns-dash-card-header">
            <h3 className="ns-dash-card-title">Recent Analyses</h3>
            <button type="button" className="ns-dash-viewall-btn">View All</button>
          </div>
          <table className="ns-dash-table">
            <thead>
              <tr>
                <th>Image ID</th>
                <th>Date</th>
                <th>Detected</th>
                <th>Dominant Type</th>
                <th>Density</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ANALYSES.map(row => (
                <tr key={row.id}>
                  <td className="ns-dash-row-id">
                    <div className="ns-dash-thumb-placeholder">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f8682" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    {row.id}
                  </td>
                  <td>{row.date}</td>
                  <td>{row.detected}</td>
                  <td><span className="ns-dash-type-badge">{row.dominantType}</span></td>
                  <td>{row.density.toFixed(2)}</td>
                  <td>
                    <span className="ns-dash-status-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Analyzed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Start New Analysis CTA Card */}
        <div className="ns-dash-cta-card">
          <div className="ns-dash-cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9cead8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <circle cx="10" cy="13" r="2" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h4 className="ns-dash-cta-title">Start a New Analysis</h4>
          <p className="ns-dash-cta-desc">Upload underwater imagery and run an AI-assisted debris analysis.</p>
          <button
            type="button"
            className="ns-dash-cta-btn"
            onClick={onNavigateToAnalysis}
          >
            Analyze an Image →
          </button>
        </div>
      </div>
    </div>
  );
}
