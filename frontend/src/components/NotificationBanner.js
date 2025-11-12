import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationBanner.css';

const NotificationBanner = ({ message, type = 'error', onDismiss, onRetry }) => {
  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`notification-banner ${type}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
        >
          <div className="banner-content">
            <span className="banner-icon">{icons[type]}</span>
            <span className="banner-message">{message}</span>
          </div>
          <div className="banner-actions">
            {onRetry && (
              <button className="banner-btn retry" onClick={onRetry}>
                Retry
              </button>
            )}
            <button className="banner-btn dismiss" onClick={onDismiss} aria-label="Dismiss">
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
