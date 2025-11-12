import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
  const [path, setPath] = useState([]);

  useEffect(() => {
    // Animate maze path
    const pathPoints = [
      { x: 10, y: 10 },
      { x: 30, y: 10 },
      { x: 30, y: 30 },
      { x: 50, y: 30 },
      { x: 50, y: 50 },
      { x: 70, y: 50 },
      { x: 70, y: 70 },
      { x: 90, y: 70 }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < pathPoints.length) {
        setPath(prev => [...prev, pathPoints[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="not-found-container">
      <motion.div
        className="not-found-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="maze-icon"
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          🧩
        </motion.div>

        <motion.h1
          className="not-found-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="not-found-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Lost in the Maze?
        </motion.h2>

        <motion.p
          className="not-found-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <svg className="maze-visualization" viewBox="0 0 100 100">
          {/* Maze grid */}
          <g className="maze-grid">
            <rect x="5" y="5" width="20" height="20" className="maze-cell" />
            <rect x="30" y="5" width="20" height="20" className="maze-cell" />
            <rect x="55" y="5" width="20" height="20" className="maze-cell" />
            <rect x="5" y="30" width="20" height="20" className="maze-cell" />
            <rect x="30" y="30" width="20" height="20" className="maze-cell" />
            <rect x="55" y="30" width="20" height="20" className="maze-cell" />
            <rect x="80" y="30" width="15" height="20" className="maze-cell" />
            <rect x="5" y="55" width="20" height="20" className="maze-cell" />
            <rect x="30" y="55" width="20" height="20" className="maze-cell" />
            <rect x="55" y="55" width="20" height="20" className="maze-cell" />
            <rect x="80" y="55" width="15" height="20" className="maze-cell" />
            <rect x="30" y="80" width="20" height="15" className="maze-cell" />
            <rect x="55" y="80" width="20" height="15" className="maze-cell" />
            <rect x="80" y="80" width="15" height="15" className="maze-cell" />
          </g>

          {/* Animated path */}
          {path.length > 1 && (
            <motion.polyline
              points={path.map(p => `${p.x},${p.y}`).join(' ')}
              className="maze-path"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          )}
        </svg>

        <motion.div
          className="not-found-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="btn-home">
            🏠 Go Home
          </Link>
          <Link to="/teams" className="btn-teams">
            👥 View Teams
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
