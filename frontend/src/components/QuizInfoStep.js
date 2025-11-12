import React from 'react';
import './QuizSteps.css';

const QuizInfoStep = ({ data, errors, onChange }) => {
  return (
    <div className="quiz-step">
      <h2 className="step-heading">Quiz Information</h2>
      <p className="step-description">Provide basic details about your quiz</p>

      <div className="form-group">
        <label htmlFor="title">
          Quiz Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter quiz title..."
          maxLength={100}
          className={errors.title ? 'error' : ''}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        <div className="char-count">{data.title.length}/100</div>
        {errors.title && (
          <div id="title-error" className="error-message" role="alert">
            {errors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Add a description (supports markdown)..."
          rows={4}
          className={errors.description ? 'error' : ''}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        <small>Markdown formatting is supported</small>
        {errors.description && (
          <div id="description-error" className="error-message" role="alert">
            {errors.description}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="duration">
          Duration (minutes) <span className="required">*</span>
        </label>
        <input
          id="duration"
          type="number"
          value={data.duration}
          onChange={(e) => onChange({ duration: parseInt(e.target.value) || 0 })}
          min={1}
          max={300}
          className={errors.duration ? 'error' : ''}
          aria-invalid={!!errors.duration}
          aria-describedby={errors.duration ? 'duration-error' : undefined}
        />
        {errors.duration && (
          <div id="duration-error" className="error-message" role="alert">
            {errors.duration}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="sequentialUnlock" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              checked={data.sequentialUnlock === true}
              onChange={() => onChange({ sequentialUnlock: true })}
            />
            ✅ Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="sequentialUnlock"
              checked={data.sequentialUnlock === false}
              onChange={() => onChange({ sequentialUnlock: false })}
            />
            No
          </label>
        </div>
        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
          Sequential mode requires answering each question correctly before unlocking the next
        </small>
      </div>
    </div>
  );
};

export default QuizInfoStep;
