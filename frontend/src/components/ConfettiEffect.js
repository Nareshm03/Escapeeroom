import React, { useEffect, useState } from 'react';
import './ConfettiEffect.css';

const ConfettiEffect = ({ active, duration = 3000, particleCount = 50 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#48bb78'][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount]);

  if (!particles.length) return null;

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
