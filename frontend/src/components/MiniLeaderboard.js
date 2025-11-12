import React from 'react';
import { motion } from 'framer-motion';
import './MiniLeaderboard.css';

const MiniLeaderboard = ({ teams = [] }) => {
  const topTeams = teams.slice(0, 3);

  return (
    <div className="mini-leaderboard">
      <h3 className="mini-leaderboard-title">🏆 Top Teams</h3>
      <div className="mini-leaderboard-list">
        {topTeams.map((team, index) => (
          <motion.div
            key={team._id}
            className="mini-leaderboard-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mini-leaderboard-rank">{index + 1}</div>
            <div className="mini-leaderboard-info">
              <div className="mini-leaderboard-name">{team.name}</div>
              <div className="mini-leaderboard-score">{team.score || 0} pts</div>
            </div>
            <div className="mini-leaderboard-change">
              {team.change > 0 ? '↑' : team.change < 0 ? '↓' : '−'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MiniLeaderboard;
