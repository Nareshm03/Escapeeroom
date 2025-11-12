import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import QuizWizard3Step from '../components/QuizWizard3Step';
import { ToastProvider } from '../utils/ToastContext';
import api from '../services/api';

jest.mock('../services/api');

const MockedWizard = () => (
  <BrowserRouter>
    <ToastProvider>
      <QuizWizard3Step />
    </ToastProvider>
  </BrowserRouter>
);

describe('QuizWizard3Step', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders step 1 by default', () => {
    render(<MockedWizard />);
    expect(screen.getByText('Quiz Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter quiz title')).toBeInTheDocument();
  });

  test('shows character counter for title', () => {
    render(<MockedWizard />);
    const input = screen.getByPlaceholderText('Enter quiz title');
    fireEvent.change(input, { target: { value: 'Test Quiz' } });
    expect(screen.getByText('9/100 characters')).toBeInTheDocument();
  });

  test('validates required fields on step 1', () => {
    render(<MockedWizard />);
    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  test('advances to step 2 with valid data', async () => {
    render(<MockedWizard />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Test Quiz' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your quiz'), {
      target: { value: 'Test Description' }
    });
    
    fireEvent.click(screen.getByText('Next →'));
    
    await waitFor(() => {
      expect(screen.getByText('Questions')).toBeInTheDocument();
    });
  });

  test('adds new question', async () => {
    render(<MockedWizard />);
    
    // Navigate to step 2
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your quiz'), {
      target: { value: 'Test' }
    });
    fireEvent.click(screen.getByText('Next →'));
    
    await waitFor(() => {
      const addButton = screen.getByText('+ Add Question');
      fireEvent.click(addButton);
      expect(screen.getByText('Q1')).toBeInTheDocument();
    });
  });

  test('auto-saves to localStorage', async () => {
    render(<MockedWizard />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Auto Save Test' }
    });
    
    await waitFor(() => {
      const saved = localStorage.getItem('quizDraft');
      expect(saved).toBeTruthy();
      const data = JSON.parse(saved);
      expect(data.title).toBe('Auto Save Test');
    }, { timeout: 2000 });
  });

  test('restores draft from localStorage', () => {
    const draft = {
      title: 'Restored Quiz',
      description: 'Restored',
      duration: 45,
      timeUnit: 'minutes',
      questions: [],
      randomizeQuestions: false
    };
    localStorage.setItem('quizDraft', JSON.stringify(draft));
    
    render(<MockedWizard />);
    
    expect(screen.getByDisplayValue('Restored Quiz')).toBeInTheDocument();
  });

  test('shows live preview', () => {
    render(<MockedWizard />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Preview Test' }
    });
    
    expect(screen.getByText('Preview Test')).toBeInTheDocument();
  });

  test('validates questions on step 2', async () => {
    render(<MockedWizard />);
    
    // Navigate to step 2
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your quiz'), {
      target: { value: 'Test' }
    });
    fireEvent.click(screen.getByText('Next →'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Next →'));
      expect(screen.getByText('Add at least one question')).toBeInTheDocument();
    });
  });

  test('publishes quiz successfully', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    render(<MockedWizard />);
    
    // Fill step 1
    fireEvent.change(screen.getByPlaceholderText('Enter quiz title'), {
      target: { value: 'Test Quiz' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your quiz'), {
      target: { value: 'Description' }
    });
    fireEvent.click(screen.getByText('Next →'));
    
    // Add question in step 2
    await waitFor(() => {
      fireEvent.click(screen.getByText('+ Add Question'));
    });
    
    const questionInput = screen.getByPlaceholderText('Enter question');
    fireEvent.change(questionInput, { target: { value: 'Test Question?' } });
    
    const option1 = screen.getByPlaceholderText('Option 1');
    fireEvent.change(option1, { target: { value: 'Answer 1' } });
    
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    
    fireEvent.click(screen.getByText('Next →'));
    
    // Publish in step 3
    await waitFor(() => {
      const publishButton = screen.getByText('🚀 Publish Quiz');
      fireEvent.click(publishButton);
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/quiz', expect.any(Object));
    });
  });
});
