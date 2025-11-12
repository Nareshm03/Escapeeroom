import React from 'react';
import { Link } from 'react-router-dom';
import './ActionTile.css';

const ActionTile = ({ to, icon, label, tooltip }) => {
  return (
    <Link 
      to={to} 
      className="action-tile"
      aria-label={tooltip}
      title={tooltip}
      role="button"
      tabIndex={0}
    >
      <span className="tile-icon">{icon}</span>
      <span className="tile-label">{label}</span>
      <svg className="tile-chevron" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6 3l5 5-5 5V3z"/>
      </svg>
    </Link>
  );
};

export default ActionTile;
