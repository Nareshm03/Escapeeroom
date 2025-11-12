import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizSteps.css';
import './QuestionControl.css';

const QuestionsStep = ({ data, errors, onChange }) => {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set([0]));

  const toggleExpand = (index) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      answer: '',
      type: 'short-answer',
      options: [],
    };
    onChange({ questions: [...data.questions, newQuestion] });
    const newExpanded = new Set(expandedQuestions);
    newExpanded.add(data.questions.length);
    setExpandedQuestions(newExpanded);
  };

  const updateQuestion = (index, updates) => {
    const updated = [...data.questions];
    updated[index] = { ...updated[index], ...updates };
    onChange({ questions: updated });
  };

  const deleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = data.questions.filter((_, idx) => idx !== index);
      onChange({ questions: updated });
      const newExpanded = new Set(expandedQuestions);
      newExpanded.delete(index);
      setExpandedQuestions(newExpanded);
    }
  };

  return (
    <div className="quiz-step">
      <h2 className="step-heading">Questions</h2>
      <p className="step-description">Add and configure your quiz questions</p>

      {errors.questions && (
        <div className="error-message" role="alert">
          {errors.questions}
        </div>
      )}

      <div className="questions-list">
        <AnimatePresence>
          {data.questions.map((q, idx) => {
            const isExpanded = expandedQuestions.has(idx);
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="question-control-card"
              >
                <div
                  className="question-control-header"
                  onClick={() => toggleExpand(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleExpand(idx)}
                  aria-expanded={isExpanded}
                  aria-controls={`question-body-${idx}`}
                >
                  <div className="question-title-section">
                    <span className="question-title">Q{idx + 1}: {q.question || 'Untitled Question'}</span>
                  </div>
                  <div className="question-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isExpanded) toggleExpand(idx);
                      }}
                      aria-label="Edit question"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-delete-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(idx);
                      }}
                      aria-label="Delete question"
                      title="Delete"
                    >
                      ❌
                    </button>
                    <button
                      className={`btn-chevron ${isExpanded ? 'expanded' : ''}`}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      ▼
                    </button>
                  </div>
                </div>

                <div
                  id={`question-body-${idx}`}
                  className={`question-control-body ${isExpanded ? 'expanded' : ''}`}
                  aria-hidden={!isExpanded}
                >
                  <div className="question-body-content">
                    <div className="form-group">
                      <label>Question Type</label>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(idx, { type: e.target.value })}
                        aria-label="Question type"
                      >
                        <option value="short-answer">Short Answer</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Question Text *</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                        placeholder="Enter question..."
                        className={errors[`q${idx}`] ? 'error' : ''}
                        aria-required="true"
                      />
                      {errors[`q${idx}`] && (
                        <div className="error-message" role="alert">{errors[`q${idx}`]}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Answer *</label>
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) => updateQuestion(idx, { answer: e.target.value })}
                        placeholder="Enter correct answer..."
                        className={errors[`a${idx}`] ? 'error' : ''}
                        aria-required="true"
                      />
                      {errors[`a${idx}`] && (
                        <div className="error-message" role="alert">{errors[`a${idx}`]}</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button className="btn-add-question" onClick={addQuestion} aria-label="Add new question">
        <span className="btn-add-icon">➕</span>
        <span className="btn-add-text">Add Question</span>
      </button>
    </div>
  );
};

export default QuestionsStep;
