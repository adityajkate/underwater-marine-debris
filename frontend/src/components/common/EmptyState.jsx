import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'Data will appear after your first analysis.',
  action,
  actionText,
  onAction,
}) {
  return (
    <div className="ns-empty-state-card">
      <div className="ns-empty-icon-circle">
        <Icon size={32} strokeWidth={1.75} />
      </div>
      <h3 className="ns-empty-state-title">{title}</h3>
      <p className="ns-empty-state-desc">{description}</p>
      {action || (actionText && onAction && (
        <button onClick={onAction} className="ns-btn-primary" style={{ marginTop: 12 }}>
          {actionText}
        </button>
      ))}
    </div>
  );
}
