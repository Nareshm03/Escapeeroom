import React from 'react';
import './EmptyState.css';

const EmptyState = ({ type = 'default', message, action, onAction }) => {
  const illustrations = {
    teams: (
      <svg viewBox="0 0 120 120" className="empty-illustration">
        <circle cx="60" cy="45" r="15" fill="#e2e8f0"/>
        <path d="M35 75 Q60 65 85 75 L85 95 L35 95 Z" fill="#cbd5e1"/>
        <circle cx="35" cy="55" r="10" fill="#e2e8f0"/>
        <circle cx="85" cy="55" r="10" fill="#e2e8f0"/>
      </svg>
    ),
    data: (
      <svg viewBox="0 0 120 120" className="empty-illustration">
        <rect x="30" y="70" width="15" height="30" fill="#e2e8f0"/>
        <rect x="52" y="50" width="15" height="50" fill="#cbd5e1"/>
        <rect x="74" y="60" width="15" height="40" fill="#e2e8f0"/>
      </svg>
    ),
    error: (
      <svg viewBox="0 0 120 120" className="empty-illustration">
        <circle cx="60" cy="60" r="35" fill="#fee2e2"/>
        <path d="M45 45 L75 75 M75 45 L45 75" stroke="#ef4444" strokeWidth="4"/>
      </svg>
    )
  };

  return (
    <div className="empty-state" role="status" aria-live="polite">
      {illustrations[type] || illustrations.default}
      <p className="empty-message">{message}</p>
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
