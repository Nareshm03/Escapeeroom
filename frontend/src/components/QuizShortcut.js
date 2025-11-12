import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import './QuizShortcut.css';

const QuizShortcut = memo(() => {
  const [stats, setStats] = useState({ published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/quiz?limit=1000');
      const published = data.quizzes.filter(q => q.isPublished).length;
      const draft = data.quizzes.filter(q => !q.isPublished).length;
      setStats({ published, draft });
    } catch (err) {
      console.error('Failed to fetch quiz stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="quiz-shortcut"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      role="region"
      aria-label="Quiz Management Shortcut"
    >
      <div className="shortcut-header">
        <h3>📋 Quiz Management</h3>
      </div>
      
      <div className="shortcut-stats">
        <div className="stat-item">
          <span className="stat-value" aria-label={`${stats.published} published quizzes`}>
            {loading ? '...' : stats.published}
          </span>
          <span className="stat-label">Published</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value" aria-label={`${stats.draft} draft quizzes`}>
            {loading ? '...' : stats.draft}
          </span>
          <span className="stat-label">Drafts</span>
        </div>
      </div>

      <div className="shortcut-actions">
        <motion.button
          className="action-btn primary"
          onClick={() => navigate('/quiz-creator')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Create new quiz"
        >
          ➕ New Quiz
        </motion.button>
        <motion.button
          className="action-btn secondary"
          onClick={() => navigate('/quiz-list')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="View all quizzes"
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  );
});

QuizShortcut.displayName = 'QuizShortcut';

export default QuizShortcut;
