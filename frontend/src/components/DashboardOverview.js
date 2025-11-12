import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    activeGames: 0,
    completedToday: 0,
    averageScore: 0,
    totalTeams: 0,
  });

  useEffect(() => {
    // Mock data - replace with API call
    setStats({
      activeGames: 3,
      completedToday: 12,
      averageScore: 87,
      totalTeams: 24,
    });
  }, []);

  const quickActions = [
    { to: '/game', icon: '🎮', label: 'Start Game', color: 'var(--primary)' },
    { to: '/teams', icon: '👥', label: 'Manage Teams', color: 'var(--success)' },
    { to: '/quiz-creator', icon: '➕', label: 'Create Quiz', color: 'var(--warning)' },
    { to: '/live', icon: '📡', label: 'Live Board', color: 'var(--info)' },
  ];

  return (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Welcome Back! 👋
        </motion.h1>
        <p>Here's what's happening with your escape room challenges</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="🎮"
          label="Active Games"
          value={stats.activeGames}
          trend={{ direction: '+', amount: 2 }}
          sparkline={[1, 2, 1, 3, 2, 3, 3]}
        />
        <StatCard
          icon="✅"
          label="Completed Today"
          value={stats.completedToday}
          trend={{ direction: '+', amount: 5 }}
          sparkline={[8, 9, 10, 11, 10, 11, 12]}
        />
        <StatCard
          icon="⭐"
          label="Average Score"
          value={`${stats.averageScore}%`}
          trend={{ direction: '+', amount: '3%' }}
          sparkline={[82, 83, 85, 84, 86, 87, 87]}
        />
        <StatCard
          icon="👥"
          label="Total Teams"
          value={stats.totalTeams}
          trend={{ direction: '+', amount: 4 }}
          sparkline={[18, 19, 20, 21, 22, 23, 24]}
        />
      </div>

      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={action.to} className="action-card">
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-label">{action.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
