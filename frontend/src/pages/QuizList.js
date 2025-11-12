import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageTransition from '../components/PageTransition';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../utils/ToastContext';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, quizId: null, quizTitle: '' });
  const [cache, setCache] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const cacheKey = `${page}-${search}-${statusFilter}`;

  useEffect(() => {
    if (cache[cacheKey]) {
      setQuizzes(cache[cacheKey].quizzes);
      setPagination(cache[cacheKey].pagination);
      setLoading(false);
    } else {
      fetchQuizzes();
    }
  }, [page, search, statusFilter]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quiz', {
        params: { page, limit: 10, search, status: statusFilter }
      });
      setQuizzes(response.data.quizzes);
      setPagination(response.data.pagination);
      setCache(prev => ({ ...prev, [cacheKey]: response.data }));
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/quiz/${deleteModal.quizId}`);
      toast.success('Quiz deleted successfully');
      setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' });
      setCache({});
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const truncate = (str, length) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <PageTransition>
      <div className="container">
        <div className="quiz-list-header">
          <h1 className="ds-heading-1">Quiz Management</h1>
          <Link to="/quiz-creator" className="btn-create-quiz">
            + Create Quiz
          </Link>
        </div>

        <div className="quiz-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search quizzes"
          />
          <div className="status-filters">
            {['all', 'draft', 'published'].map(status => (
              <button
                key={status}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                aria-label={`Filter by ${status}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="quiz-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="quiz-card skeleton"></div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <p>No quizzes found</p>
          </div>
        ) : (
          <>
            <div className="quiz-grid">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz._id}
                  className="quiz-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
                >
                  <div className="quiz-card-header">
                    <Link
                      to={`/quiz/${quiz.quizLink}`}
                      className="quiz-title"
                      title={quiz.title}
                    >
                      {truncate(quiz.title, 50)}
                    </Link>
                    <span className={`status-badge status-${quiz.isPublished ? 'published' : 'draft'}`}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="quiz-card-body">
                    <div className="quiz-meta">
                      <span className="quiz-questions">
                        📝 {quiz.questions?.length || 0} questions
                      </span>
                      <span className="quiz-date">
                        📅 {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="quiz-card-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/quiz-creator?edit=${quiz._id}`)}
                      aria-label="Edit quiz"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/results?quiz=${quiz._id}`)}
                      aria-label="View results"
                      title="View Results"
                    >
                      📊
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => setDeleteModal({
                        isOpen: true,
                        quizId: quiz._id,
                        quizTitle: quiz.title
                      })}
                      aria-label="Delete quiz"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === pagination.pages}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete Quiz"
          message={`Are you sure you want to delete "${deleteModal.quizTitle}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' })}
        />
      </div>
    </PageTransition>
  );
};

export default QuizList;