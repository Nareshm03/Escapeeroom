import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/StatusIndicator.css';

const StatusIndicator = ({ icon, label, value, status, lastUpdated, onQuickAction }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState(null);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      setAutoHideTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleMouseEnter = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    setAutoHideTimer(timer);
  };

  const getStatusColor = () => {
    if (status === 'active' || status === 'on') return 'var(--secondary)';
    if (status === 'inactive' || status === 'off') return 'rgba(255, 255, 255, 0.4)';
    return 'var(--primary)';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="status-indicator"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
    >
      <span className="status-icon" style={{ color: getStatusColor() }}>
        {icon}
      </span>
      <span className="status-value" style={{ color: getStatusColor() }}>
        {value}
      </span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="status-tooltip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tooltip-header">{label}</div>
            <div className="tooltip-status">
              Status: <strong style={{ color: getStatusColor() }}>{value}</strong>
            </div>
            <div className="tooltip-updated">
              Updated: {formatTimestamp(lastUpdated)}
            </div>
            {onQuickAction && (
              <button 
                className="tooltip-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAction();
                  setShowTooltip(false);
                }}
              >
                Quick Action
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusIndicator;
