import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLoader from '../components/GameLoader';
import GameInterface from '../components/GameInterface';

const GamePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const questions = [
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'What color is the sky?', answer: 'blue' },
    { question: 'How many days in a week?', answer: '7' },
    { question: 'What is the capital of France?', answer: 'paris' },
    { question: 'How many continents are there?', answer: '7' },
  ];

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  const handleGameComplete = (results) => {
    localStorage.removeItem('gameState');
    navigate('/results', { state: results });
  };

  return (
    <div className="container">
      {isLoading ? (
        <GameLoader onLoadComplete={handleLoadComplete} />
      ) : (
        <GameInterface questions={questions} onComplete={handleGameComplete} />
      )}
    </div>
  );
};

export default GamePage;
