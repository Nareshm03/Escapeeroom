import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './StatCard.css';

const StatCard = memo(({ icon, label, value, trend, sparkline }) => {
  const trendDirection = trend?.direction === '+' ? 'up' : 'down';
  const trendColor = trend?.direction === '+' ? 'var(--success)' : 'var(--danger)';

  const renderSparkline = () => {
    if (!sparkline || sparkline.length === 0) return null;

    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    const width = 100;
    const height = 30;
    const step = width / (sparkline.length - 1);

    const points = sparkline
      .map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg 
        className="stat-sparkline" 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div 
      className="stat-card" 
      role="article" 
      aria-label={`${label}: ${value}`}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon" aria-hidden="true">
          {icon}
        </div>
        {trend && (
          <div 
            className={`stat-card-trend trend-${trendDirection}`}
            style={{ color: trendColor }}
            aria-label={`Trend: ${trend.direction}${trend.amount}`}
          >
            <span className="trend-arrow">
              {trend.direction === '+' ? '↑' : '↓'}
            </span>
            <span className="trend-amount">{trend.amount}</span>
          </div>
        )}
      </div>

      <div className="stat-card-content">
        <div className="stat-card-value" aria-live="polite">
          {value}
        </div>
        <div className="stat-card-label">
          {label}
        </div>
      </div>

      {sparkline && sparkline.length > 0 && (
        <div className="stat-card-footer">
          {renderSparkline()}
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(['+', '-']).isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  sparkline: PropTypes.arrayOf(PropTypes.number),
};

StatCard.defaultProps = {
  trend: null,
  sparkline: null,
};

export default StatCard;
