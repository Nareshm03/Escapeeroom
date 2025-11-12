import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../utils/ToastContext';
import api from '../services/api';
import '../styles/QuizWizard3Step.css';

const QuizWizard3Step = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 30,
    timeUnit: 'minutes',
    questions: [],
    randomizeQuestions: false,
    sequentialUnlock: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('quizDraft');
    if (saved) {
      setQuizData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('quizDraft', JSON.stringify(quizData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [quizData]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!quizData.title.trim()) newErrors.title = 'Title is required';
    if (quizData.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (!quizData.description.trim()) newErrors.description = 'Description is required';
    if (quizData.duration < 1) newErrors.duration = 'Duration must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (quizData.questions.length === 0) {
      newErrors.questions = 'Add at least one question';
    } else {
      quizData.questions.forEach((q, i) => {
        if (!q.text.trim()) newErrors[`q${i}`] = 'Question text required';
        if (q.type === 'multiple-choice' && q.options.length < 2) {
          newErrors[`q${i}options`] = 'Add at least 2 options';
        }
        if (!q.correctAnswer) newErrors[`q${i}answer`] = 'Mark correct answer';
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, {
        text: '',
        type: 'multiple-choice',
        options: ['', ''],
        correctAnswer: '',
        points: 10
      }]
    });
  };

  const removeQuestion = (index) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((_, i) => i !== index)
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...quizData.questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizData({ ...quizData, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...quizData.questions];
    updated[qIndex].options.push('');
    setQuizData({ ...quizData, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...quizData.questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuizData({ ...quizData, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...quizData.questions];
    updated[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await api.post('/api/quiz', quizData);
      localStorage.removeItem('quizDraft');
      success('Quiz published successfully!');
      navigate('/quiz-list');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to publish quiz');
    } finally {
      setSaving(false);
    }
  };

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="page-container">
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>Create Quiz</h1>
          <div className="progress-indicator">
            {[1, 2, 3].map(step => (
              <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 ? 'Info' : step === 2 ? 'Questions' : 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-content">
          <div className="wizard-main">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <div className="glass-card wizard-step">
                    <h2>Quiz Information</h2>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={quizData.title}
                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        maxLength={100}
                        placeholder="Enter quiz title"
                      />
                      {errors.title && <span className="error-text">{errors.title}</span>}
                      <small>{quizData.title.length}/100 characters</small>
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={quizData.description}
                        onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                        rows={4}
                        placeholder="Describe your quiz"
                      />
                      {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>
                    <div className="form-group">
                      <label>Duration *</label>
                      <div className="duration-input">
                        <input
                          type="number"
                          value={quizData.duration}
                          onChange={(e) => setQuizData({ ...quizData, duration: parseInt(e.target.value) || 0 })}
                          min={1}
                        />
                        <select
                          value={quizData.timeUnit}
                          onChange={(e) => setQuizData({ ...quizData, timeUnit: e.target.value })}
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                      {errors.duration && <span className="error-text">{errors.duration}</span>}
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Enable Sequential Unlock Mode
                        <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }} title="When enabled, questions unlock one at a time after answering the previous question correctly">
                          ℹ️
                        </span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="sequentialUnlock"
                            checked={quizData.sequentialUnlock === true}
                            onChange={() => setQuizData({ ...quizData, sequentialUnlock: true })}
                          />
                          ✅ Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="sequentialUnlock"
                            checked={quizData.sequentialUnlock === false}
                            onChange={() => setQuizData({ ...quizData, sequentialUnlock: false })}
                          />
                          No
                        </label>
                      </div>
                      <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                        Sequential mode requires answering each question correctly before unlocking the next
                      </small>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="glass-card wizard-step">
                    <div className="step-header">
                      <h2>Questions</h2>
                      <button onClick={addQuestion} className="btn-primary">+ Add Question</button>
                    </div>
                    {errors.questions && <div className="error-text">{errors.questions}</div>}
                    <div className="questions-list">
                      {quizData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="glass-card-sm question-card">
                          <div className="question-header">
                            <span className="numeric">Q{qIndex + 1}</span>
                            <button onClick={() => removeQuestion(qIndex)} className="btn-remove">×</button>
                          </div>
                          <div className="form-group">
                            <label>Question Text *</label>
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                              placeholder="Enter question"
                            />
                            {errors[`q${qIndex}`] && <span className="error-text">{errors[`q${qIndex}`]}</span>}
                          </div>
                          <div className="form-group">
                            <label>Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="true-false">True/False</option>
                              <option value="short-answer">Short Answer</option>
                            </select>
                          </div>
                          {q.type === 'multiple-choice' && (
                            <div className="form-group">
                              <label>Options *</label>
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="option-row">
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={q.correctAnswer === opt}
                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', opt)}
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                  />
                                  {q.options.length > 2 && (
                                    <button onClick={() => removeOption(qIndex, oIndex)} className="btn-remove-small">×</button>
                                  )}
                                </div>
                              ))}
                              <button onClick={() => addOption(qIndex)} className="btn-glass btn-sm">+ Add Option</button>
                              {errors[`q${qIndex}options`] && <span className="error-text">{errors[`q${qIndex}options`]}</span>}
                              {errors[`q${qIndex}answer`] && <span className="error-text">{errors[`q${qIndex}answer`]}</span>}
                            </div>
                          )}
                          {q.type === 'true-false' && (
                            <div className="form-group">
                              <label>Correct Answer *</label>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                              >
                                <option value="">Select...</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          )}
                          <div className="form-group">
                            <label>Points</label>
                            <input
                              type="number"
                              value={q.points}
                              onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 0)}
                              min={1}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={quizData.randomizeQuestions}
                          onChange={(e) => setQuizData({ ...quizData, randomizeQuestions: e.target.checked })}
                        />
                        Randomize question order
                      </label>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="glass-card wizard-step">
                    <h2>Review & Publish</h2>
                    <div className="review-section">
                      <h3>Quiz Details</h3>
                      <div className="review-item">
                        <strong>Title:</strong> {quizData.title}
                      </div>
                      <div className="review-item">
                        <strong>Description:</strong> {quizData.description}
                      </div>
                      <div className="review-item">
                        <strong>Duration:</strong> {quizData.duration} {quizData.timeUnit}
                      </div>
                      <div className="review-item">
                        <strong>Questions:</strong> {quizData.questions.length}
                      </div>
                      <div className="review-item">
                        <strong>Total Points:</strong> <span className="numeric">{quizData.questions.reduce((sum, q) => sum + q.points, 0)}</span>
                      </div>
                      <div className="review-item">
                        <strong>Randomize:</strong> {quizData.randomizeQuestions ? 'Yes' : 'No'}
                      </div>
                      <div className="review-item">
                        <strong>Sequential Unlock:</strong> {quizData.sequentialUnlock ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="review-section">
                      <h3>Questions Preview</h3>
                      {quizData.questions.map((q, i) => (
                        <div key={i} className="preview-question">
                          <div className="preview-q-header">
                            <span className="numeric">Q{i + 1}</span>
                            <span className="points">{q.points} pts</span>
                          </div>
                          <p>{q.text}</p>
                          {q.type === 'multiple-choice' && (
                            <ul>
                              {q.options.map((opt, j) => (
                                <li key={j} className={opt === q.correctAnswer ? 'correct-answer' : ''}>
                                  {opt} {opt === q.correctAnswer && '✓'}
                                </li>
                              ))}
                            </ul>
                          )}
                          {q.type === 'true-false' && (
                            <p className="correct-answer">Answer: {q.correctAnswer}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="wizard-actions">
              {currentStep > 1 && (
                <button onClick={prevStep} className="btn-glass">← Previous</button>
              )}
              {currentStep < 3 ? (
                <button onClick={nextStep} className="btn-primary">Next →</button>
              ) : (
                <button onClick={handlePublish} className="btn-primary" disabled={saving}>
                  {saving ? 'Publishing...' : '🚀 Publish Quiz'}
                </button>
              )}
            </div>
          </div>

          <div className="wizard-preview">
            <div className="glass-card preview-pane">
              <h3>Live Preview</h3>
              <div className="preview-content">
                <h4>{quizData.title || 'Untitled Quiz'}</h4>
                <p className="caption">{quizData.description || 'No description'}</p>
                <div className="preview-stats">
                  <div className="stat">
                    <span className="numeric">{quizData.questions.length}</span>
                    <span className="caption">Questions</span>
                  </div>
                  <div className="stat">
                    <span className="numeric">{quizData.duration}</span>
                    <span className="caption">{quizData.timeUnit}</span>
                  </div>
                  <div className="stat">
                    <span className="numeric">{quizData.questions.reduce((sum, q) => sum + q.points, 0)}</span>
                    <span className="caption">Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizWizard3Step;
