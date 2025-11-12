import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import useCountUp from '../hooks/useCountUp';
import './AnimatedStatCard.css';

const AnimatedStatCard = ({ 
  title, 
  value, 
  total, 
  icon, 
  format = 'number',
  inView = true 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();
  
  const animatedValue = useCountUp(value, 1500, inView);
  const percentage = total ? Math.round((value / total) * 100) : 0;

  useEffect(() => {
    if (inView) {
      controls.start({ width: `${percentage}%` });
      setProgress(percentage);
    }
  }, [inView, percentage, controls]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getProgressColor = (percent) => {
    if (percent < 33) return '#ef4444';
    if (percent < 66) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <motion.div
      className="animated-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="article"
      aria-label={`${title}: ${value}${total ? ` of ${total}` : ''}`}
    >
      <div className="card-header">
        <span className="card-icon" aria-hidden="true">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-value">
        {format === 'number' && formatNumber(animatedValue)}
        {format === 'percentage' && `${animatedValue}%`}
        {total && <span className="card-total"> / {formatNumber(total)}</span>}
      </div>

      {total && (
        <div className="progress-container">
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={controls}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ 
                backgroundColor: getProgressColor(progress),
                willChange: 'width'
              }}
            />
          </div>
          <motion.span 
            className="progress-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {progress}%
          </motion.span>
        </div>
      )}

      <motion.div
        className="tooltip"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? 0 : 10
        }}
        transition={{ duration: 0.3 }}
        role="tooltip"
      >
        Based on current team reports
        <div className="tooltip-arrow" />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedStatCard;
