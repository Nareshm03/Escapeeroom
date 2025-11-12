import { validateQuizData, validateStep, getQuizSummary } from './quizValidation';

describe('Quiz Validation Service', () => {
  describe('validateQuizData', () => {
    test('should pass validation for valid quiz data', () => {
      const validQuiz = {
        title: 'Test Quiz',
        description: 'Test Description',
        duration: 30,
        questions: [
          { question: 'Q1', answer: 'A1', points: 10 },
          { question: 'Q2', answer: 'A2', points: 20 }
        ]
      };

      const result = validateQuizData(validQuiz);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('should fail when title is empty', () => {
      const quiz = {
        title: '',
        description: 'Test',
        duration: 30,
        questions: [{ question: 'Q1', answer: 'A1', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    test('should fail when title exceeds 100 characters', () => {
      const quiz = {
        title: 'a'.repeat(101),
        description: 'Test',
        duration: 30,
        questions: [{ question: 'Q1', answer: 'A1', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be under 100 characters');
    });

    test('should fail when description is empty', () => {
      const quiz = {
        title: 'Test',
        description: '',
        duration: 30,
        questions: [{ question: 'Q1', answer: 'A1', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required');
    });

    test('should fail when duration is less than 1', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 0,
        questions: [{ question: 'Q1', answer: 'A1', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.duration).toBe('Duration must be at least 1 minute');
    });

    test('should fail when no questions exist', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: []
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.questions).toBe('At least one question is required');
    });

    test('should fail when question text is empty', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: [{ question: '', answer: 'A1', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.q0_text).toBe('Question 1: Text is required');
    });

    test('should fail when answer is empty', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: [{ question: 'Q1', answer: '', points: 10 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.q0_answer).toBe('Question 1: Answer is required');
    });

    test('should fail when points are negative', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: [{ question: 'Q1', answer: 'A1', points: -5 }]
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.q0_points).toBe('Question 1: Points must be positive');
    });

    test('should accumulate multiple errors', () => {
      const quiz = {
        title: '',
        description: '',
        duration: 0,
        questions: []
      };

      const result = validateQuizData(quiz);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });
  });

  describe('validateStep', () => {
    test('should validate step 0 (info) correctly', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: []
      };

      const result = validateStep(0, quiz);
      expect(result.isValid).toBe(true);
    });

    test('should validate step 1 (questions) correctly', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: [{ question: 'Q1', answer: 'A1' }]
      };

      const result = validateStep(1, quiz);
      expect(result.isValid).toBe(true);
    });

    test('should fail step 1 when no questions', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: []
      };

      const result = validateStep(1, quiz);
      expect(result.isValid).toBe(false);
      expect(result.errors.questions).toBe('Add at least one question');
    });
  });

  describe('getQuizSummary', () => {
    test('should generate correct summary', () => {
      const quiz = {
        title: 'Test Quiz',
        description: 'Test Description',
        duration: 45,
        questions: [
          { points: 10 },
          { points: 20 },
          { points: 30 }
        ]
      };

      const summary = getQuizSummary(quiz);
      expect(summary.title).toBe('Test Quiz');
      expect(summary.description).toBe('Test Description');
      expect(summary.duration).toBe(45);
      expect(summary.questionCount).toBe(3);
      expect(summary.totalPoints).toBe(60);
    });

    test('should handle empty questions array', () => {
      const quiz = {
        title: 'Test',
        description: 'Test',
        duration: 30,
        questions: []
      };

      const summary = getQuizSummary(quiz);
      expect(summary.questionCount).toBe(0);
      expect(summary.totalPoints).toBe(0);
    });
  });
});
