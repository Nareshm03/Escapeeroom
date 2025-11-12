import React from 'react';
import './HeroSection.css';

const HeroSection = ({ 
  title = "Welcome back, Admin!", 
  subtitle = "Quick overview and controls to manage the platform",
  status = "Active",
  timeWindow = "60m"
}) => {
  const statusColor = status === "Active" ? "#48bb78" : "#9ca3af";

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
      <div className="hero-status">
        <span className="status-pill" style={{ backgroundColor: statusColor }}>
          {status}
        </span>
        <div className="time-info">
          <svg className="clock-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.5 3v4.21l2.65 1.53-.5.87L7.5 8.79V4h1z"/>
          </svg>
          <span>Time window: {timeWindow}</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
