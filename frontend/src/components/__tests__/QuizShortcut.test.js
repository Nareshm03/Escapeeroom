import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import QuizShortcut from '../QuizShortcut';
import api from '../../services/api';

jest.mock('../../services/api');

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <QuizShortcut />
    </BrowserRouter>
  );
};

describe('QuizShortcut', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with loading state', () => {
    api.get.mockResolvedValue({ data: { quizzes: [] } });
    renderComponent();
    expect(screen.getByText('Quiz Management')).toBeInTheDocument();
  });

  it('fetches and displays quiz statistics', async () => {
    api.get.mockResolvedValue({
      data: {
        quizzes: [
          { isPublished: true },
          { isPublished: true },
          { isPublished: false }
        ]
      }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/2 published quizzes/i)).toHaveTextContent('2');
      expect(screen.getByLabelText(/1 draft quizzes/i)).toHaveTextContent('1');
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    api.get.mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Published')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('navigates to quiz creator on New Quiz button click', async () => {
    api.get.mockResolvedValue({ data: { quizzes: [] } });
    const user = userEvent.setup();

    renderComponent();

    const newQuizBtn = await screen.findByLabelText('Create new quiz');
    await user.click(newQuizBtn);
  });

  it('navigates to quiz list on View All button click', async () => {
    api.get.mockResolvedValue({ data: { quizzes: [] } });
    const user = userEvent.setup();

    renderComponent();

    const viewAllBtn = await screen.findByLabelText('View all quizzes');
    await user.click(viewAllBtn);
  });

  it('has proper accessibility attributes', async () => {
    api.get.mockResolvedValue({ data: { quizzes: [] } });
    renderComponent();

    expect(screen.getByRole('region', { name: 'Quiz Management Shortcut' })).toBeInTheDocument();
    expect(screen.getByLabelText('Create new quiz')).toBeInTheDocument();
    expect(screen.getByLabelText('View all quizzes')).toBeInTheDocument();
  });
});
