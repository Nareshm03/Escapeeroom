import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './QuestionManager.css';

const QuestionManager = ({ question, onChange, onRemove, index, errors = {} }) => {
  const [localQuestion, setLocalQuestion] = useState(question || {
    type: 'short-answer',
    text: '',
    correctAnswer: '',
    points: 10,
    timeLimit: 120
  });

  const handleChange = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onChange(updated);
  };

  const validateAnswer = (answer) => {
    return answer && answer.trim().length > 0;
  };

  const validatePoints = (points) => {
    const num = parseInt(points);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  return (
    <motion.div
      className="question-manager"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="question-header">
        <h3 className="gradient-header">Question {index + 1}</h3>
        <button
          className="btn-remove"
          onClick={onRemove}
          aria-label="Remove question"
        >
          ✕
        </button>
      </div>

      {/* Question Type Section */}
      <div className="form-section">
        <label className="section-label">Question Type</label>
        <select
          className="form-input"
          value={localQuestion.type}
          onChange={(e) => handleChange('type', e.target.value)}
          aria-label="Select question type"
        >
          <option value="short-answer">Short Answer</option>
        </select>
      </div>

      {/* Question Text */}
      <div className="form-section">
        <label className="section-label">
          Question Text <span className="required">*</span>
        </label>
        <textarea
          className={`form-input ${errors.text ? 'error' : ''}`}
          value={localQuestion.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter your question..."
          rows="3"
          required
          aria-label="Question text"
          aria-required="true"
        />
        {errors.text && <span className="error-message">{errors.text}</span>}
      </div>

      {/* Answer Input Section */}
      <div className="form-section answer-section">
        <label className="section-label">Answer Input</label>
        
        {/* Correct Answer Field */}
        <div className="answer-field">
          <label className="field-label">
            Correct Answer <span className="required">*</span>
            <span className="help-text">Case-insensitive matching</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.correctAnswer ? 'error' : ''}`}
            value={localQuestion.correctAnswer}
            onChange={(e) => handleChange('correctAnswer', e.target.value)}
            placeholder="Enter the correct answer..."
            required
            aria-label="Correct answer"
            aria-required="true"
            aria-describedby="answer-help"
          />
          <small id="answer-help" className="help-text">
            Answer will be compared case-insensitively
          </small>
          {errors.correctAnswer && (
            <span className="error-message">{errors.correctAnswer}</span>
          )}
        </div>

        {/* Points Field */}
        <div className="points-field">
          <label className="field-label">
            Points <span className="required">*</span>
          </label>
          <input
            type="number"
            className={`form-input ${errors.points ? 'error' : ''}`}
            value={localQuestion.points}
            onChange={(e) => handleChange('points', e.target.value)}
            min="0"
            max="100"
            required
            aria-label="Points value"
            aria-required="true"
            aria-describedby="points-help"
          />
          <small id="points-help" className="help-text">
            Value between 0 and 100
          </small>
          {errors.points && (
            <span className="error-message">{errors.points}</span>
          )}
        </div>
      </div>

      {/* Time Limit */}
      <div className="form-section">
        <label className="field-label">Time Limit (seconds)</label>
        <input
          type="number"
          className="form-input"
          value={localQuestion.timeLimit}
          onChange={(e) => handleChange('timeLimit', e.target.value)}
          min="10"
          max="600"
          aria-label="Time limit in seconds"
        />
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="validation-summary" role="alert">
          <strong>⚠️ Please fix the following errors:</strong>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionManager;
