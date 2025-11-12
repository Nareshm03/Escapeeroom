import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GameInterface.css';

const GameInterface = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState([]);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const { currentIndex: idx, timer: t, answers: ans } = JSON.parse(savedState);
      setCurrentIndex(idx);
      setTimer(t);
      setAnswers(ans);
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({ currentIndex, timer, answers }));
  }, [currentIndex, timer, answers]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const isCorrect = answer.trim().toLowerCase() === questions[currentIndex].answer.toLowerCase();

    if (isCorrect) {
      setFeedback('success');
      const newAnswers = [...answers, { question: currentIndex, answer, time: timer }];
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setAnswer('');
          setFeedback(null);
        } else {
          onComplete({ answers: newAnswers, totalTime: timer });
        }
        setIsSubmitting(false);
      }, 1500);
    } else {
      setFeedback('error');
      setTimeout(() => {
        setFeedback(null);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="game-interface">
      <div className="game-header">
        <div className="timer" aria-live="polite" aria-atomic="true">
          ⏱️ {formatTime(timer)}
        </div>
        <div className="stage-indicator">
          Stage {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={`game-card ${feedback || ''}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="question-text">{currentQuestion.question}</h2>

          <form onSubmit={handleSubmit} className="answer-form">
            <input
              ref={inputRef}
              type="text"
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              disabled={isSubmitting}
              aria-label="Answer input"
              autoComplete="off"
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={!answer.trim() || isSubmitting}
            >
              {isSubmitting ? 'Checking...' : 'Submit'}
            </button>
          </form>

          <AnimatePresence>
            {feedback === 'success' && (
              <motion.div
                className="feedback success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                ✅ Correct!
              </motion.div>
            )}
            {feedback === 'error' && (
              <motion.div
                className="feedback error"
                initial={{ x: -10 }}
                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ❌ Try again
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="progress-dots">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx < currentIndex ? 'completed' : ''} ${idx === currentIndex ? 'active' : ''}`}
            aria-label={`Question ${idx + 1} ${idx < currentIndex ? 'completed' : idx === currentIndex ? 'current' : 'pending'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GameInterface;
