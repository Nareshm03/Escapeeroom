import React from 'react';
import './SkeletonLoader.css';

export const SkeletonStatCard = () => (
  <div className="glass-stat-card skeleton-card">
    <div className="stat-header">
      <div className="skeleton skeleton-circle"></div>
      <div className="skeleton skeleton-badge"></div>
    </div>
    <div className="skeleton skeleton-value"></div>
    <div className="stat-footer">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-sparkline"></div>
    </div>
  </div>
);

export const SkeletonTile = () => (
  <div className="action-tile skeleton-card">
    <div className="skeleton skeleton-icon"></div>
    <div className="skeleton skeleton-tile-label"></div>
    <div className="skeleton skeleton-chevron"></div>
  </div>
);

export const SkeletonLeaderboard = () => (
  <div className="skeleton-leaderboard">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="skeleton-row">
        <div className="skeleton skeleton-rank"></div>
        <div className="skeleton skeleton-team"></div>
        <div className="skeleton skeleton-stage"></div>
        <div className="skeleton skeleton-time"></div>
      </div>
    ))}
  </div>
);
