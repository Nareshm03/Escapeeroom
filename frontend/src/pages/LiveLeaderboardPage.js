import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PodiumWidget from '../components/PodiumWidget';
import LeaderboardEntry from '../components/LeaderboardEntry';
import { useToast } from '../utils/ToastContext';
import '../styles/design-tokens.css';
import '../styles/LiveLeaderboard.css';

const LiveLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [rankChanges, setRankChanges] = useState({});
  const previousLeaderboard = useRef([]);
  const toast = useToast();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await api.get('/api/leaderboard');
      const newData = response.data || [];
      
      // Detect rank changes
      const changes = {};
      newData.forEach((entry, index) => {
        const oldIndex = previousLeaderboard.current.findIndex(
          (old) => old.team_name === entry.team_name
        );
        if (oldIndex !== -1 && oldIndex !== index) {
          changes[entry.team_name] = true;
        }
      });
      
      setRankChanges(changes);
      previousLeaderboard.current = newData;
      setLeaderboard(newData);
      setLastUpdate(new Date());
      
      // Clear rank change indicators after animation
      setTimeout(() => setRankChanges({}), 300);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (loading) {
        toast.error('Failed to load leaderboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, toast]);

  const formatTimestamp = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="skeleton-podium">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-podium-item" />
          ))}
        </div>
        <div className="skeleton-entries">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-entry" />
          ))}
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🔴 Live Leaderboard</h1>
        <div className="leaderboard-controls">
          <button
            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
            aria-label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            aria-pressed={autoRefresh}
          >
            <span className="toggle-icon">{autoRefresh ? '⏸️' : '▶️'}</span>
            <span className="toggle-label">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
          </button>
          <div className="last-update">
            <span className="update-label">Last update:</span>
            <time className="update-time">{formatTimestamp(lastUpdate)}</time>
          </div>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <motion.div
          className="empty-leaderboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="empty-icon">🏆</div>
          <h2>No Submissions Yet</h2>
          <p>Complete quizzes to see teams on the leaderboard!</p>
        </motion.div>
      ) : (
        <>
          {topThree.length > 0 && <PodiumWidget topThree={topThree} />}

          <div className="leaderboard-list">
            <AnimatePresence mode="popLayout">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={entry.team_name}
                  entry={entry}
                  rank={index + 1}
                  onRankChange={rankChanges[entry.team_name]}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveLeaderboardPage;