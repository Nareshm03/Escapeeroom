import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import Sparkline from './Sparkline';
import './EnhancedStatCard.css';

const EnhancedStatCard = ({ icon, value, label, trend = [], decimals = 0, loading = false }) => {
  if (loading) {
    return <div className="enhanced-stat-card skeleton"></div>;
  }

  return (
    <motion.div
      className="enhanced-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
    >
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className="stat-card-value">
        <AnimatedCounter value={value} decimals={decimals} />
        {decimals > 0 && '%'}
      </div>
      <div className="stat-card-label">{label}</div>
      {trend.length > 0 && (
        <div className="stat-card-trend">
          <Sparkline data={trend} width={120} height={30} color="#667eea" />
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedStatCard;
