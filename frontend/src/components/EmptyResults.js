import React from 'react';
import { motion } from 'framer-motion';
import './EmptyResults.css';

const EmptyResults = ({ onReset }) => {
  return (
    <motion.div
      className="empty-results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.svg
        className="empty-illustration"
        viewBox="0 0 200 200"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <circle cx="100" cy="100" r="80" fill="var(--bg-secondary)" />
        <path
          d="M70 90 Q100 70 130 90"
          stroke="var(--text-tertiary)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="80" cy="85" r="8" fill="var(--text-tertiary)" />
        <circle cx="120" cy="85" r="8" fill="var(--text-tertiary)" />
        <path
          d="M75 130 Q100 145 125 130"
          stroke="var(--text-tertiary)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </motion.svg>

      <h3 className="empty-title">No Results Found</h3>
      <p className="empty-message">
        We couldn't find any results matching your current filters.
        Try adjusting your search criteria or reset the filters.
      </p>

      <button className="btn btn-primary" onClick={onReset}>
        Reset Filters
      </button>
    </motion.div>
  );
};

export default EmptyResults;
