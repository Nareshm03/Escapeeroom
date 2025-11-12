import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './EventStatusBanner.css';

const EventStatusBanner = ({ status = 'paused', startTime, onToggle }) => {
  const [duration, setDuration] = useState('00:00:00');

  useEffect(() => {
    if (status === 'active' && startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - new Date(startTime).getTime();
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setDuration(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  return (
    <motion.div
      className={`event-status-banner event-status-${status}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="event-status-indicator">
        <span className="event-status-dot"></span>
        <span className="event-status-text">
          {status === 'active' ? 'Event Active' : 'Event Paused'}
        </span>
      </div>
      {status === 'active' && (
        <div className="event-duration">Duration: {duration}</div>
      )}
      <button
        className="event-toggle-btn"
        onClick={onToggle}
        aria-label={status === 'active' ? 'Pause event' : 'Start event'}
      >
        {status === 'active' ? '⏸ Pause' : '▶ Start'}
      </button>
    </motion.div>
  );
};

export default EventStatusBanner;
