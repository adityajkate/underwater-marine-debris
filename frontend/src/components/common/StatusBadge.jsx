import React from 'react';

export default function StatusBadge({ status, text, size = 'md' }) {
  // status: 'online' | 'offline' | 'checking' | 'active' | 'success' | 'warning' | 'info'
  const getStatusClass = () => {
    switch (status) {
      case 'online':
      case 'success':
      case 'completed':
        return 'ns-status-online';
      case 'offline':
      case 'error':
        return 'ns-status-offline';
      case 'checking':
      case 'processing':
      case 'warning':
        return 'ns-status-warning';
      case 'info':
      default:
        return 'ns-status-info';
    }
  };

  return (
    <span className={`ns-status-pill ${getStatusClass()} ns-status-${size}`}>
      <span className="ns-status-dot" />
      <span>{text || status}</span>
    </span>
  );
}
