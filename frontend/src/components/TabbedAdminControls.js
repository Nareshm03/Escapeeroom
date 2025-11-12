import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/TabbedAdminControls.css';

const TabbedAdminControls = ({ teams = [] }) => {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System', icon: '⚡' },
    { id: 'quizzes', label: 'Quizzes', icon: '➕' },
    { id: 'teams', label: 'Teams', icon: '📜' },
    { id: 'reports', label: 'Reports', icon: '⚙️' }
  ];

  const tabContent = {
    system: [
      { to: '/admin', icon: '⚡', title: 'Admin Panel', desc: 'System administration and monitoring' }
    ],
    quizzes: [
      { to: '/quiz-creator', icon: '➕', title: 'Create Quiz', desc: 'Design new quiz challenges' },
      { to: '/quiz-list', icon: '📋', title: 'Quiz List', desc: 'Manage and edit existing quizzes' }
    ],
    teams: [
      { to: '/settings', icon: '⚙️', title: 'Settings', desc: 'Configure global application settings' }
    ],
    reports: [
      { to: '/results', icon: '📊', title: 'Reports', desc: 'View detailed reports and analytics' }
    ]
  };

  const ActionCard = ({ to, action, icon, title, desc, index }) => {
    const card = (
      <motion.div
        className="action-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="action-card-icon">{icon}</div>
        <h3 className="action-card-title">{title}</h3>
        <p className="action-card-desc">{desc}</p>
      </motion.div>
    );

    return to ? (
      <Link to={to} style={{ textDecoration: 'none' }} aria-label={`${title}. ${desc}`}>
        {card}
      </Link>
    ) : (
      <button 
        className="action-card-button" 
        onClick={() => console.log(action)}
        aria-label={`${title}. ${desc}`}
      >
        {card}
      </button>
    );
  };

  return (
    <div className="tabbed-admin-controls" role="region" aria-label="Admin Controls">
      <h2 className="controls-title">🔒 Admin Controls</h2>
      
      <div className="tabs-container" role="tablist" aria-label="Admin control categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="tab-indicator"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
          className="tab-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="action-cards-grid">
            {tabContent[activeTab].map((item, index) => (
              <ActionCard key={item.title} {...item} index={index} />
            ))}
          </div>

          {activeTab === 'teams' && teams.length > 0 && (
            <motion.div
              className="teams-table-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="table-title">All Teams</h3>
              <div className="table-wrapper">
                <table className="teams-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, i) => (
                      <motion.tr
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <td>{team.name}</td>
                        <td>{team.description}</td>
                        <td>{new Date(team.created_at).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabbedAdminControls;
