/**
 * Question Validation Utilities
 */

export const validateQuestion = (question) => {
  const errors = {};

  // Validate question text
  if (!question.text || question.text.trim().length === 0) {
    errors.text = 'Question text is required';
  }

  // Validate correct answer (required)
  if (!question.correctAnswer || question.correctAnswer.trim().length === 0) {
    errors.correctAnswer = 'Correct answer is required';
  }

  // Validate points (0-100)
  const points = parseInt(question.points);
  if (isNaN(points)) {
    errors.points = 'Points must be a number';
  } else if (points < 0) {
    errors.points = 'Points cannot be negative';
  } else if (points > 100) {
    errors.points = 'Points cannot exceed 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAllQuestions = (questions) => {
  const allErrors = [];
  let isValid = true;

  questions.forEach((question, index) => {
    const { isValid: questionValid, errors } = validateQuestion(question);
    if (!questionValid) {
      isValid = false;
      allErrors[index] = errors;
    }
  });

  return {
    isValid,
    errors: allErrors
  };
};

/**
 * Case-insensitive answer comparison
 */
export const compareAnswers = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

/**
 * Normalize answer for storage
 */
export const normalizeAnswer = (answer) => {
  return answer ? answer.trim() : '';
};

/**
 * Format question data for API
 */
export const formatQuestionForAPI = (question) => {
  return {
    type: question.type || 'short-answer',
    questionText: question.text,
    correctAnswer: normalizeAnswer(question.correctAnswer),
    points: parseInt(question.points) || 0,
    timeLimitSeconds: parseInt(question.timeLimit) || 120
  };
};
