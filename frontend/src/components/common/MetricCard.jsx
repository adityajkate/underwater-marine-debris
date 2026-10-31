import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  trend,
  className = '',
}) {
  return (
    <div className={`ns-stat-card ${className}`}>
      <div className="ns-stat-card-header">
        <span className="ns-stat-card-title">{title}</span>
        {Icon && (
          <div className="ns-stat-icon-box">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="ns-stat-card-value">{value}</div>
      {(subtitle || trend || badge) && (
        <div className="ns-stat-card-footer">
          {badge && <span className="ns-stat-badge">{badge}</span>}
          {trend && <span className="ns-stat-trend">{trend}</span>}
          {subtitle && <span className="ns-stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
