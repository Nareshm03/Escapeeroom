import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './LiveLeaderboardWidget.css';

const LiveLeaderboardWidget = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/leaderboard');
      setTeams((response.data || []).slice(0, 5));
      setError(null);
    } catch (err) {
      setError({ message: 'Failed to load leaderboard', statusCode: err.response?.status });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="live-leaderboard-widget" role="region" aria-label="Live Leaderboard">
      <div className="widget-header">
        <h3>🏆 Live Leaderboard</h3>
        <span className="live-indicator" aria-label="Live updates active">●</span>
      </div>

      {loading ? (
        <div className="widget-loading">Loading...</div>
      ) : error ? (
        <div className="widget-error">
          {error.message}
          <button className="retry-link" onClick={fetchLeaderboard}>Retry</button>
        </div>
      ) : teams.length === 0 ? (
        <div className="widget-empty">No teams yet</div>
      ) : (
        <>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Stage</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id || index}>
                  <td className="rank-cell">{index + 1}</td>
                  <td className="team-cell">{team.team_name || team.name || 'Unknown'}</td>
                  <td className="stage-cell">{team.stage || team.current_stage || 1}</td>
                  <td className="time-cell">{formatTime(team.time || team.elapsed_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link to="/live-leaderboard" className="view-full-link">
            View full →
          </Link>
        </>
      )}
    </div>
  );
};

export default LiveLeaderboardWidget;
