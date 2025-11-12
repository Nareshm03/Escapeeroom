import React from 'react';
import './ErrorBanner.css';

const ErrorBanner = ({ message, statusCode, timestamp, onRetry, onDismiss }) => {
  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <div className="error-content">
        <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
        </svg>
        <div className="error-details">
          <div className="error-message">{message}</div>
          <div className="error-meta">
            {statusCode && <span>Error {statusCode}</span>}
            {timestamp && <span>{new Date(timestamp).toLocaleTimeString()}</span>}
          </div>
        </div>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button className="error-btn retry-btn" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="error-btn dismiss-btn" onClick={onDismiss} aria-label="Dismiss error">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
