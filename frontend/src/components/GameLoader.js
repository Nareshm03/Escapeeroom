import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GameLoader.css';

const GameLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);

  const hints = [
    '💡 Tip: Look for patterns in the data',
    '🔍 Hint: Sometimes the answer is in plain sight',
    '🧩 Remember: Each puzzle builds on the last',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const hintInterval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(hintInterval);
    };
  }, [onLoadComplete]);

  const estimatedTime = Math.ceil((100 - progress) / 20);

  return (
    <div className="game-loader" role="status" aria-live="polite">
      <motion.div
        className="loader-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="loader-title">Loading Game...</h2>
        
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={hintIndex}
            className="hint-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {hints[hintIndex]}
          </motion.div>
        </AnimatePresence>

        {estimatedTime > 0 && (
          <div className="estimated-time">
            Estimated time: {estimatedTime}s
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GameLoader;
