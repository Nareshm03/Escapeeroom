import React from 'react';
import { motion } from 'framer-motion';
import '../styles/EmptyTeamsState.css';

const EmptyTeamsState = ({ onCreateTeam }) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="floating-dots">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="dot"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`
            }}
          />
        ))}
      </div>

      <svg
        className="empty-illustration"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="80" fill="var(--color-primary-100)" opacity="0.3" />
        <circle cx="70" cy="80" r="25" fill="var(--color-primary-300)" />
        <circle cx="130" cy="80" r="25" fill="var(--color-primary-400)" />
        <circle cx="100" cy="130" r="25" fill="var(--color-primary-500)" />
        <path
          d="M70 80 L100 130 L130 80"
          stroke="var(--color-primary-600)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <h2 className="empty-title">No teams yet</h2>
      <p className="empty-description">
        Create your first team to start collaborating and tracking progress
      </p>

      <div className="empty-actions">
        <button onClick={onCreateTeam} className="btn-primary">
          ➕ Create your first team
        </button>
        <a href="#learn" className="btn-link">
          Learn about teams
        </a>
      </div>
    </motion.div>
  );
};

export default EmptyTeamsState;
