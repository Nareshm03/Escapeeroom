import React from 'react';
import './SkeletonLoaders.css';

export const SkeletonCard = () => (
  <div className="ds-skeleton-card">
    <div className="ds-skeleton ds-skeleton-title"></div>
    <div className="ds-skeleton ds-skeleton-text"></div>
    <div className="ds-skeleton ds-skeleton-text" style={{ width: '80%' }}></div>
    <div className="ds-skeleton ds-skeleton-button"></div>
  </div>
);

export const SkeletonList = ({ items = 5 }) => (
  <div className="ds-skeleton-list">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="ds-skeleton-list-item">
        <div className="ds-skeleton ds-skeleton-avatar"></div>
        <div style={{ flex: 1 }}>
          <div className="ds-skeleton ds-skeleton-text" style={{ width: '60%' }}></div>
          <div className="ds-skeleton ds-skeleton-text" style={{ width: '40%' }}></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonImage = ({ width = '100%', height = '200px' }) => (
  <div className="ds-skeleton ds-skeleton-image" style={{ width, height }}></div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="ds-skeleton-text-block">
    {[...Array(lines)].map((_, i) => (
      <div 
        key={i} 
        className="ds-skeleton ds-skeleton-text"
        style={{ width: i === lines - 1 ? '70%' : '100%' }}
      ></div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="ds-skeleton-table">
    <div className="ds-skeleton-table-header">
      {[...Array(columns)].map((_, i) => (
        <div key={i} className="ds-skeleton ds-skeleton-text"></div>
      ))}
    </div>
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="ds-skeleton-table-row">
        {[...Array(columns)].map((_, colIndex) => (
          <div key={colIndex} className="ds-skeleton ds-skeleton-text"></div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ items = 6, columns = 3 }) => (
  <div 
    className="ds-skeleton-grid" 
    style={{ 
      gridTemplateColumns: `repeat(${columns}, 1fr)` 
    }}
  >
    {[...Array(items)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
