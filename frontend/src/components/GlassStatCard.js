import React from 'react';
import './GlassStatCard.css';
import useCountUp from '../hooks/useCountUp';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const GlassStatCard = ({ icon, value, label, trend, loading }) => {
  const trendPositive = trend >= 0;
  const [ref, isVisible] = useIntersectionObserver();
  
  const numericValue = typeof value === 'string' ? parseInt(value) : value;
  const isPercentage = typeof value === 'string' && value.includes('%');
  const animatedValue = useCountUp(numericValue, 1800, isVisible && !loading);
  const displayValue = loading ? '…' : (isPercentage ? `${animatedValue}%` : animatedValue);
  
  return (
    <div ref={ref} className="glass-stat-card card-parallax animate-slide-up" aria-live="polite">
      <div className="stat-header">
        <div className="icon-chip">{icon}</div>
        {trend !== undefined && (
          <div className={`trend-badge ${trendPositive ? 'positive' : 'negative'}`}>
            {trendPositive ? '+' : '−'}{Math.abs(trend)} today
          </div>
        )}
      </div>
      <div className="stat-value">{displayValue}</div>
      <div className="stat-footer">
        <div className="stat-label">{label}</div>
        <svg className="sparkline" viewBox="0 0 80 30" preserveAspectRatio="none">
          <polyline
            points="0,25 20,15 40,20 60,8 80,12"
            fill="none"
            stroke="rgba(100, 116, 139, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default GlassStatCard;
