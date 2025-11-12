import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuizInfoStep from './QuizInfoStep';
import QuestionsStep from './QuestionsStep';
import ReviewStep from './ReviewStep';
import PublishConfirmationModal from './PublishConfirmationModal';
import { validateQuizData, validateStep, getQuizSummary } from '../utils/quizValidation';
import './QuizWizard.css';

const QuizWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [],
  });
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const draft = localStorage.getItem('quizDraft');
    if (draft) {
      setQuizData(JSON.parse(draft));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('quizDraft', JSON.stringify(quizData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [quizData]);

  const steps = [
    { title: 'Info', label: 'Quiz Information', component: QuizInfoStep },
    { title: 'Questions', label: 'Add Questions', component: QuestionsStep },
    { title: 'Review', label: 'Review & Submit', component: ReviewStep },
  ];

  // Real-time validation
  useEffect(() => {
    const isValid = validateStepRealtime(currentStep);
    setCanProceed(isValid);
  }, [quizData, currentStep]);

  const validateStepRealtime = (step) => {
    if (step === 0) {
      return quizData.title.trim().length > 0 && 
             quizData.title.length <= 100 && 
             quizData.duration >= 1;
    }
    if (step === 1) {
      return quizData.questions.length > 0 && 
             quizData.questions.every(q => q.question?.trim() && q.answer?.trim());
    }
    return true;
  };

  const validateCurrentStep = (step) => {
    const validation = validateStep(step, quizData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleNext = () => {
    setIsValidating(true);
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setErrors({});
      setIsValidating(false);
    } else {
      setTimeout(() => {
        const firstError = document.querySelector('.error-message, input.error, textarea.error');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError?.focus();
        setIsValidating(false);
      }, 100);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePublishClick = () => {
    const validation = validateQuizData(quizData);
    if (validation.isValid) {
      setShowConfirmModal(true);
    } else {
      setErrors(validation.errors);
      setTimeout(() => {
        const firstError = document.querySelector('.error-message, input.error, textarea.error');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError?.focus();
      }, 100);
    }
  };

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem('quizDraft');
      setShowConfirmModal(false);
      navigate('/quiz-list', { state: { published: true } });
    } catch (error) {
      setErrors({ submit: 'Failed to publish quiz' });
      setShowConfirmModal(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const updateQuizData = (updates) => {
    setQuizData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="quiz-wizard">
      <div className="wizard-progress" role="navigation" aria-label="Quiz creation progress">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin="1"
            aria-valuemax={steps.length}
          />
        </div>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`progress-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''} ${idx > currentStep ? 'inactive' : ''}`}
            role="tab"
            aria-selected={idx === currentStep}
            aria-label={`Step ${idx + 1}: ${step.label}`}
          >
            <div className="step-circle">
              <div className="step-number">
                {idx < currentStep ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
            </div>
            <div className="step-info">
              <div className="step-label">{step.title}</div>
              <div className="step-description">{step.label}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.98 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="wizard-content"
          role="tabpanel"
          aria-labelledby={`step-${currentStep}`}
        >
          <StepComponent
            data={quizData}
            errors={errors}
            onChange={updateQuizData}
            onPublish={handlePublishClick}
            onEdit={setCurrentStep}
          />
        </motion.div>
      </AnimatePresence>

      <div className="wizard-actions">
        {currentStep > 0 && (
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
            aria-label="Go to previous step"
          >
            ← Back
          </button>
        )}
        <div className="action-spacer" />
        {currentStep < steps.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            disabled={!canProceed || isValidating}
            aria-label="Go to next step"
            aria-disabled={!canProceed}
          >
            {isValidating ? 'Validating...' : 'Next →'}
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handlePublishClick}
            disabled={isPublishing}
            aria-label="Publish quiz"
          >
            {isPublishing ? 'Publishing...' : '✓ Publish Quiz'}
          </button>
        )}
      </div>

      <PublishConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handlePublishConfirm}
        onCancel={() => setShowConfirmModal(false)}
        quizSummary={getQuizSummary(quizData)}
      />
    </div>
  );
};

export default QuizWizard;
