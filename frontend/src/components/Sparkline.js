import React from 'react';
import { motion } from 'framer-motion';

const Sparkline = ({ data = [], width = 100, height = 30, color = '#667eea' }) => {
  if (!data.length) return null;

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
};

export default Sparkline;
