import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizManagement.css';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 20;

  useEffect(() => {
    // Mock data - replace with API call
    setQuizzes([
      { id: 1, title: 'Escape Challenge 1', status: 'published', duration: 3600, questions: 10 },
      { id: 2, title: 'Logic Puzzle', status: 'draft', duration: 1800, questions: 5 },
      { id: 3, title: 'Math Quiz', status: 'published', duration: 2400, questions: 8 },
    ]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quizzes, searchTerm, statusFilter]);

  const sortedQuizzes = useMemo(() => {
    const sorted = [...filteredQuizzes].sort((a, b) => {
      if (sortConfig.key === 'duration' || sortConfig.key === 'questions') {
        return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
    return sorted;
  }, [filteredQuizzes, sortConfig]);

  const paginatedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedQuizzes.slice(start, start + itemsPerPage);
  }, [sortedQuizzes, currentPage]);

  const totalPages = Math.ceil(sortedQuizzes.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleTogglePublish = async (quiz) => {
    setConfirmDialog({
      title: quiz.status === 'published' ? 'Unpublish Quiz?' : 'Publish Quiz?',
      message: `Are you sure you want to ${quiz.status === 'published' ? 'unpublish' : 'publish'} "${quiz.title}"?`,
      onConfirm: async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setQuizzes((prev) =>
          prev.map((q) => (q.id === quiz.id ? { ...q, status: q.status === 'published' ? 'draft' : 'published' } : q))
        );
        setLoading(false);
        setConfirmDialog(null);
      },
    });
  };

  const handleDelete = (quiz) => {
    setConfirmDialog({
      title: 'Delete Quiz?',
      message: `Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
        setLoading(false);
        setConfirmDialog(null);
      },
    });
  };

  const handleDuplicate = async (quiz) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newQuiz = { ...quiz, id: Date.now(), title: `${quiz.title} (Copy)`, status: 'draft' };
    setQuizzes((prev) => [...prev, newQuiz]);
    setLoading(false);
  };

  return (
    <div className="quiz-management">
      <div className="management-header">
        <h1>Quiz Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/quiz-creator')}>
          ➕ Create New Quiz
        </button>
      </div>

      <div className="management-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search quizzes"
        />
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="table-container">
        <table className="quiz-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')} className="sortable">
                Quiz Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable center">
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('duration')} className="sortable right">
                Duration {sortConfig.key === 'duration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('questions')} className="sortable center">
                Questions {sortConfig.key === 'questions' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuizzes.map((quiz) => (
              <tr
                key={quiz.id}
                onMouseEnter={() => setHoveredRow(quiz.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="quiz-title">{quiz.title}</td>
                <td className="center">
                  <span className={`status-badge ${quiz.status}`}>{quiz.status}</span>
                </td>
                <td className="right">{formatDuration(quiz.duration)}</td>
                <td className="center">{quiz.questions}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button className="btn-action" onClick={() => navigate(`/quiz-creator?id=${quiz.id}`)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-action" onClick={() => navigate(`/results?quiz=${quiz.id}`)} title="View Results">
                      📊
                    </button>
                    <button className="btn-action" onClick={() => handleTogglePublish(quiz)} title={quiz.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {quiz.status === 'published' ? '👁️' : '🚀'}
                    </button>
                    <button className="btn-action danger" onClick={() => handleDelete(quiz)} title="Delete">
                      🗑️
                    </button>
                  </div>
                  <AnimatePresence>
                    {hoveredRow === quiz.id && (
                      <motion.div
                        className="hover-actions"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button className="hover-btn" onClick={() => handleDuplicate(quiz)}>
                          📋 Duplicate
                        </button>
                        <button className="hover-btn" onClick={() => alert('Preview')}>
                          👁️ Preview
                        </button>
                        <button className="hover-btn" onClick={() => alert('Share')}>
                          🔗 Share
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDialog(null)}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{confirmDialog.title}</h3>
              <p>{confirmDialog.message}</p>
              <div className="dialog-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDialog(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={confirmDialog.onConfirm} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizManagement;
