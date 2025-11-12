import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSettings } from '../utils/SettingsContext';

const QuizTaker = () => {
  const { link } = useParams();
  const { settings } = useSettings();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [teamNameSet, setTeamNameSet] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [unlockedQuestions, setUnlockedQuestions] = useState([0]);

  useEffect(() => {
    fetchQuiz();
    applySecuritySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link, settings]);

  const applySecuritySettings = () => {
    const handleKeyDown = (e) => {
      if (!settings.allowCut && (e.ctrlKey && e.key === 'x')) e.preventDefault();
      if (!settings.allowCopy && (e.ctrlKey && e.key === 'c')) e.preventDefault();
      if (!settings.allowPaste && (e.ctrlKey && e.key === 'v')) e.preventDefault();
      if (!settings.allowPrint && (e.ctrlKey && e.key === 'p')) e.preventDefault();
    };

    const handleContextMenu = (e) => {
      if (!settings.allowRightClick) e.preventDefault();
    };

    const handleBeforeUnload = (e) => {
      if (settings.confirmBeforeCloseBrowser) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  };

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/${link}`);
      const data = response.data?.quiz;
      if (!data) {
        throw new Error('Missing quiz data in response');
      }
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(''));
      // Use settings time limit if enabled, otherwise use quiz default
      const timeLimit = settings.hasTimeLimit ? settings.timeLimit * 60 : data.totalTimeMinutes * 60;
      setTotalTimeLeft(timeLimit);
      // Initialize unlocked questions based on sequential mode
      if (data.sequential_unlock_enabled) {
        setUnlockedQuestions([0]);
      } else {
        setUnlockedQuestions(data.questions.map((_, i) => i));
      }
    } catch (error) {
      alert('Quiz not found');
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim()) return;

    // Show confirmation if enabled
    if (settings.confirmBeforeSubmit) {
      if (!window.confirm('Are you sure you want to submit this answer?')) {
        return;
      }
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);

    // Check if answer is correct
    try {
      const checkResponse = await api.post(`/quiz/${link}/check`, {
        questionIndex: currentQuestion,
        answer: currentAnswer,
        unlockedQuestions: unlockedQuestions
      });
      
      if (checkResponse.data.correct) {
        setMessage('✅ Correct! Moving to next question...');
        setCurrentAnswer('');
        
        // Unlock next question if sequential mode is enabled
        if (quiz.sequential_unlock_enabled && currentQuestion < quiz.questions.length - 1) {
          const nextQuestion = currentQuestion + 1;
          if (!unlockedQuestions.includes(nextQuestion)) {
            setUnlockedQuestions([...unlockedQuestions, nextQuestion]);
            console.log(`Question ${nextQuestion + 1} unlocked`);
          }
        }
        
        if (currentQuestion < quiz.questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestion(currentQuestion + 1);
            setMessage('');
            // Use settings page time limit if enabled
            const pageTimeLimit = settings.pageTimeLimits ? settings.defaultPageTimeLimit : quiz.questions[currentQuestion + 1].timeLimitSeconds;
            setTimeLeft(pageTimeLimit);
          }, 1500);
        } else {
          // Final submission
          setTimeout(async () => {
            try {
              const submitResponse = await api.post(`/quiz/${link}/submit`, {
                teamName,
                answers: newAnswers
              });
              setResult(submitResponse.data);
            } catch (error) {
              alert('Failed to submit quiz');
            }
          }, 1500);
        }
      } else {
        setMessage('❌ Incorrect answer. Try again!');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage('🔒 This question is locked. Complete previous questions first.');
      } else {
        setMessage('Error checking answer. Try again!');
      }
    }
  };

  const setTeamNameAndStart = (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      setTeamNameSet(true);
      // Use settings page time limit if enabled
      const pageTimeLimit = settings.pageTimeLimits ? settings.defaultPageTimeLimit : quiz.questions[0].timeLimitSeconds;
      setTimeLeft(pageTimeLimit);
    }
  };

  useEffect(() => {
    if (!teamNameSet || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setMessage('Time up for this question!');
          return 0;
        }
        return prev - 1;
      });

      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          alert('Total quiz time is up!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [teamNameSet, quiz, currentQuestion]);

  useEffect(() => {
    if (quiz && quiz.questions[currentQuestion]) {
      // Use settings page time limit if enabled
      const pageTimeLimit = settings.pageTimeLimits ? settings.defaultPageTimeLimit : quiz.questions[currentQuestion].timeLimitSeconds;
      setTimeLeft(pageTimeLimit);
    }
  }, [currentQuestion, quiz, settings]);

  if (result) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>🎉 Quiz Completed!</h2>
          <h3>Team: {teamName}</h3>
          <p><strong>Your Score: {result.score} / {result.total}</strong></p>
          <p>Percentage: {Math.round((result.score / result.total) * 100)}%</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="container">Loading...</div>;
  }

  if (!teamNameSet) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
          {settings.showPageTitles && <h2>{quiz.title}</h2>}
          <p>{quiz.description}</p>
          
          <form onSubmit={setTeamNameAndStart}>
            <div className="form-group">
              <label>Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isQuestionLocked = quiz.sequential_unlock_enabled && !unlockedQuestions.includes(currentQuestion);

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
        {quiz.sequential_unlock_enabled && (
          <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
              Question Progress:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quiz.questions.map((_, index) => {
                const isUnlocked = unlockedQuestions.includes(index);
                const isCurrent = index === currentQuestion;
                const isAnswered = answers[index] && answers[index].trim() !== '';
                return (
                  <button
                    key={index}
                    onClick={() => isUnlocked && setCurrentQuestion(index)}
                    disabled={!isUnlocked}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: isCurrent ? '2px solid #007bff' : '1px solid #dee2e6',
                      background: isAnswered ? '#28a745' : isUnlocked ? '#fff' : '#e9ecef',
                      color: isAnswered ? '#fff' : isUnlocked ? '#495057' : '#adb5bd',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    title={isUnlocked ? `Question ${index + 1}` : `🔒 Locked - Answer previous questions first`}
                  >
                    {isUnlocked ? index + 1 : '🔒'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {settings.showPageTitles && <h2>Team: {teamName}</h2>}
          <div style={{ textAlign: 'right' }}>
            <div>Question {currentQuestion + 1} of {quiz.questions.length}</div>
            <div style={{ color: timeLeft <= 10 ? '#dc3545' : '#666', fontSize: '14px' }}>
              Question Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div style={{ color: totalTimeLeft <= 60 ? '#dc3545' : '#666', fontSize: '12px' }}>
              Total Time: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="card" style={{ position: 'relative', opacity: isQuestionLocked ? 0.6 : 1 }}>
          {isQuestionLocked && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              zIndex: 10
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ color: '#495057', marginBottom: '8px' }}>Question Locked</h3>
              <p style={{ color: '#6c757d', textAlign: 'center', maxWidth: '300px' }}>
                Complete the previous question correctly to unlock this one
              </p>
            </div>
          )}
          {settings.autoNumberQuestions && <h3>Question {currentQuestion + 1}</h3>}
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>{question.questionText}</p>
          
          <form onSubmit={submitAnswer}>
            <div className="form-group">
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Enter your answer..."
                required
                disabled={isQuestionLocked}
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={timeLeft === 0 || totalTimeLeft === 0 || isQuestionLocked}
            >
              Submit Answer
            </button>
          </form>
          
          {message && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '4px',
              backgroundColor: message.includes('Correct') ? '#d4edda' : '#f8d7da',
              color: message.includes('Correct') ? '#155724' : '#721c24'
            }}>
              {message}
            </div>
          )}
        </div>
        
        {settings.showProgressBar && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Progress: {currentQuestion + 1} / {quiz.questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;