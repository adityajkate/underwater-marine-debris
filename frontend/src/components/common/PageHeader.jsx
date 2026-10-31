import React from 'react';

export default function PageHeader({ title, subtitle, badge, action, children }) {
  return (
    <div className="ns-workbench-header">
      <div>
        <div className="ns-header-title-row">
          <h1 className="ns-workbench-title">{title}</h1>
          {badge && <span className="ns-header-badge">{badge}</span>}
        </div>
        {subtitle && <p className="ns-workbench-subtitle">{subtitle}</p>}
      </div>
      {(action || children) && (
        <div className="ns-header-actions">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
