import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from '../hooks/useWebSocket';
import './RealTimeLeaderboard.css';

const RealTimeLeaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const { data, isConnected } = useWebSocket('ws://localhost:5000/leaderboard');

  useEffect(() => {
    if (data) {
      setRankings(data.rankings || []);
    }
  }, [data]);

  useEffect(() => {
    // Mock data fallback
    setRankings([
      { id: 1, team: 'Team Alpha', score: 950, time: 1200, rank: 1 },
      { id: 2, team: 'Team Beta', score: 920, time: 1350, rank: 2 },
      { id: 3, team: 'Team Gamma', score: 890, time: 1400, rank: 3 },
    ]);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'var(--warning)';
    if (rank === 2) return 'var(--text-tertiary)';
    if (rank === 3) return '#cd7f32';
    return 'var(--text-primary)';
  };

  return (
    <div className="real-time-leaderboard">
      <div className="leaderboard-header">
        <h1>🏆 Live Leaderboard</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      <div className="leaderboard-content">
        <AnimatePresence mode="popLayout">
          {rankings.map((entry, idx) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="leaderboard-entry"
            >
              <div className="rank-badge" style={{ color: getRankColor(entry.rank) }}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
              </div>
              <div className="team-info">
                <div className="team-name">{entry.team}</div>
                <div className="team-meta">
                  Score: {entry.score} • Time: {formatTime(entry.time)}
                </div>
              </div>
              <div className="score-display">{entry.score}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RealTimeLeaderboard;
