import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './DataCards.css';

const DataCards = ({ totalTeams, averageScore, fastestEscape }) => {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cards = [
    {
      icon: '👥',
      label: 'Total Teams',
      value: totalTeams,
      color: 'var(--primary)',
    },
    {
      icon: '📊',
      label: 'Average Score',
      value: `${averageScore}%`,
      color: 'var(--success)',
    },
    {
      icon: '⚡',
      label: 'Fastest Escape',
      value: fastestEscape ? formatTime(fastestEscape.time) : '--:--:--',
      subtitle: fastestEscape?.team || 'No data',
      color: 'var(--warning)',
    },
  ];

  return (
    <div className="data-cards">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="data-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="card-content">
            <div className="card-label">{card.label}</div>
            <div className="card-value">{card.value}</div>
            {card.subtitle && <div className="card-subtitle">{card.subtitle}</div>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

DataCards.propTypes = {
  totalTeams: PropTypes.number.isRequired,
  averageScore: PropTypes.number.isRequired,
  fastestEscape: PropTypes.shape({
    team: PropTypes.string,
    time: PropTypes.number,
  }),
};

export default DataCards;
