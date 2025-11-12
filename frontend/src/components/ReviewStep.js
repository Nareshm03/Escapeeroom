import React from 'react';
import { validateQuizData } from '../utils/quizValidation';
import './QuizSteps.css';

const ReviewStep = ({ data, onEdit, errors }) => {
  const validation = validateQuizData(data);
  const hasErrors = !validation.isValid;
  return (
    <div className="quiz-step">
      <h2 className="step-heading">Review & Submit</h2>
      <p className="step-description">Review your quiz before publishing</p>

      <div className="review-section">
        <div className="review-header">
          <h3>Quiz Information</h3>
          <button className="btn-edit" onClick={() => onEdit(0)}>
            ✏️ Edit
          </button>
        </div>
        <div className="review-content">
          <div className="review-item">
            <span className="review-label">Title:</span>
            <span className="review-value">{data.title}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Description:</span>
            <span className="review-value">{data.description || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Duration:</span>
            <span className="review-value">{data.duration} minutes</span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <div className="review-header">
          <h3>Questions ({data.questions.length})</h3>
          <button className="btn-edit" onClick={() => onEdit(1)}>
            ✏️ Edit
          </button>
        </div>
        <div className="review-content">
          {data.questions.map((q, idx) => (
            <div key={q.id} className="review-question">
              <div className="question-number">Q{idx + 1}</div>
              <div className="question-details">
                <div className="question-text">{q.question}</div>
                <div className="question-meta">
                  Type: {q.type} • Answer: {q.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasErrors && (
        <div className="validation-errors" role="alert">
          <h3>⚠️ Please fix the following errors before publishing:</h3>
          <ul>
            {Object.entries(validation.errors).map(([field, message]) => (
              <li key={field}>
                <button
                  className="error-link"
                  onClick={() => {
                    if (field.startsWith('q') || field === 'questions') {
                      onEdit(1);
                    } else {
                      onEdit(0);
                    }
                  }}
                  aria-label={`Fix error: ${message}`}
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasErrors && (
        <div className="publish-notice">
          <strong>✓ Ready to publish!</strong> Once published, your quiz will be available to all teams.
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
