import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Toast.css';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.type - 'success' | 'error' | 'warning'
 * @param {string} props.message - Notification message
 * @param {Function} props.onClose - Close callback
 * @param {number} props.duration - Auto-dismiss duration (ms)
 */
const Toast = ({ type = 'success', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (type === 'success' && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };

  const ariaLabels = {
    success: 'Success notification',
    error: 'Error notification',
    warning: 'Warning notification'
  };

  return (
    <motion.div
      className={`toast toast-${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-label={ariaLabels[type]}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="toast-icon" aria-hidden="true">
        {icons[type]}
      </div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
        type="button"
      >
        ✕
      </button>
    </motion.div>
  );
};

export default Toast;
