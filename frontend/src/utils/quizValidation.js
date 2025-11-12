/* Quiz Validation Service */

export const validateQuizData = (quizData) => {
  const errors = {};

  // Title validation
  if (!quizData.title || !quizData.title.trim()) {
    errors.title = 'Title is required';
  } else if (quizData.title.length > 100) {
    errors.title = 'Title must be under 100 characters';
  }

  // Description validation
  if (!quizData.description || !quizData.description.trim()) {
    errors.description = 'Description is required';
  }

  // Duration validation
  if (!quizData.duration || quizData.duration < 1) {
    errors.duration = 'Duration must be at least 1 minute';
  }

  // Questions validation
  if (!quizData.questions || quizData.questions.length === 0) {
    errors.questions = 'At least one question is required';
  } else {
    quizData.questions.forEach((q, idx) => {
      if (!q.question || !q.question.trim()) {
        errors[`q${idx}_text`] = `Question ${idx + 1}: Text is required`;
      }
      if (!q.answer || !q.answer.trim()) {
        errors[`q${idx}_answer`] = `Question ${idx + 1}: Answer is required`;
      }
      if (q.points === undefined || q.points < 0) {
        errors[`q${idx}_points`] = `Question ${idx + 1}: Points must be positive`;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStep = (step, quizData) => {
  const errors = {};

  if (step === 0) {
    if (!quizData.title || !quizData.title.trim()) {
      errors.title = 'Title is required';
    } else if (quizData.title.length > 100) {
      errors.title = 'Title must be under 100 characters';
    }

    if (!quizData.description || !quizData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!quizData.duration || quizData.duration < 1) {
      errors.duration = 'Duration must be at least 1 minute';
    }
  }

  if (step === 1) {
    if (!quizData.questions || quizData.questions.length === 0) {
      errors.questions = 'Add at least one question';
    } else {
      quizData.questions.forEach((q, idx) => {
        if (!q.question || !q.question.trim()) {
          errors[`q${idx}`] = 'Question text is required';
        }
        if (!q.answer || !q.answer.trim()) {
          errors[`a${idx}`] = 'Answer is required';
        }
      });
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getQuizSummary = (quizData) => {
  return {
    title: quizData.title,
    description: quizData.description,
    duration: quizData.duration,
    questionCount: quizData.questions?.length || 0,
    totalPoints: quizData.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0
  };
};
