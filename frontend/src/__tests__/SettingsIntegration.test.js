import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../pages/Settings';
import { SettingsProvider } from '../utils/SettingsContext';
import { ToastProvider } from '../utils/ToastContext';
import api from '../services/api';

jest.mock('../services/api');

const MockedSettings = () => (
  <ToastProvider>
    <SettingsProvider>
      <Settings />
    </SettingsProvider>
  </ToastProvider>
);

describe('Settings Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Integration', () => {
    test('fetches settings on mount', async () => {
      const mockSettings = {
        quizName: 'Test Quiz',
        showQuizName: true,
        hasTimeLimit: true,
        timeLimit: 60
      };

      api.get.mockResolvedValue({ data: mockSettings });

      render(<MockedSettings />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/api/settings');
      });
    });

    test('saves settings to backend', async () => {
      api.get.mockResolvedValue({ data: {} });
      api.post.mockResolvedValue({ data: { success: true } });

      render(<MockedSettings />);

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Enter application name/i);
        fireEvent.change(input, { target: { value: 'Updated Name' } });
      });

      const saveButton = screen.getByText(/Save Settings/i);
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
          quizName: 'Updated Name'
        }));
      });
    });

    test('handles API errors gracefully', async () => {
      api.get.mockResolvedValue({ data: {} });
      api.post.mockRejectedValue(new Error('Network error'));

      render(<MockedSettings />);

      await waitFor(() => {
        const saveButton = screen.getByText(/Save Settings/i);
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('navigates between all tabs', async () => {
      api.get.mockResolvedValue({ data: {} });

      render(<MockedSettings />);

      // Start on General tab
      await waitFor(() => {
        expect(screen.getByText(/General Settings/i)).toBeInTheDocument();
      });

      // Navigate to Event Settings
      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);
      await waitFor(() => {
        expect(screen.getByText(/Enable Global Time Limit/i)).toBeInTheDocument();
      });

      // Navigate to Security
      const securityTab = screen.getByText(/Security/i);
      fireEvent.click(securityTab);
      await waitFor(() => {
        expect(screen.getByText(/Browser Restrictions/i)).toBeInTheDocument();
      });
    });

    test('maintains state when switching tabs', async () => {
      api.get.mockResolvedValue({ data: {} });

      render(<MockedSettings />);

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Enter application name/i);
        fireEvent.change(input, { target: { value: 'Test Name' } });
      });

      // Switch to Event tab
      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);

      // Switch back to General
      const generalTab = screen.getByText(/General/i);
      fireEvent.click(generalTab);

      // Value should be preserved
      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Enter application name/i);
        expect(input.value).toBe('Test Name');
      });
    });
  });

  describe('Form Interactions', () => {
    test('handles checkbox toggles', async () => {
      api.get.mockResolvedValue({ data: { showQuizName: false } });

      render(<MockedSettings />);

      await waitFor(() => {
        const checkbox = screen.getByLabelText(/Show Application Name in Header/i);
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
      });
    });

    test('handles number input changes', async () => {
      api.get.mockResolvedValue({ data: {} });

      render(<MockedSettings />);

      // Navigate to Event Settings
      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);

      await waitFor(() => {
        const input = screen.getByLabelText(/Global Time Limit \(minutes\)/i);
        fireEvent.change(input, { target: { value: '45' } });
        expect(input.value).toBe('45');
      });
    });

    test('handles select dropdown changes', async () => {
      api.get.mockResolvedValue({ data: {} });

      render(<MockedSettings />);

      await waitFor(() => {
        const select = screen.getByLabelText(/Question Layout/i);
        fireEvent.change(select, { target: { value: 'horizontal' } });
        expect(select.value).toBe('horizontal');
      });
    });

    test('shows conditional fields based on checkbox state', async () => {
      api.get.mockResolvedValue({ data: { hasTimeLimit: false } });

      render(<MockedSettings />);

      // Navigate to Event Settings
      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);

      await waitFor(() => {
        // Time limit input should not be visible
        expect(screen.queryByLabelText(/Global Time Limit \(minutes\)/i)).not.toBeInTheDocument();
      });

      // Enable time limit
      const checkbox = screen.getByLabelText(/Enable Global Time Limit/i);
      fireEvent.click(checkbox);

      await waitFor(() => {
        // Time limit input should now be visible
        expect(screen.getByLabelText(/Global Time Limit \(minutes\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Security Settings', () => {
    test('displays all security options', async () => {
      api.get.mockResolvedValue({ data: {} });

      render(<MockedSettings />);

      const securityTab = screen.getByText(/Security/i);
      fireEvent.click(securityTab);

      await waitFor(() => {
        expect(screen.getByText(/Allow Cut \(Ctrl\+X\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Allow Copy \(Ctrl\+C\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Allow Paste \(Ctrl\+V\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Allow Right Click Context Menu/i)).toBeInTheDocument();
        expect(screen.getByText(/Allow Print \(Ctrl\+P\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Allow Previous Page Navigation/i)).toBeInTheDocument();
        expect(screen.getByText(/Track Attempts by Browser/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirm Before Submit/i)).toBeInTheDocument();
        expect(screen.getByText(/Warn Before Closing Browser/i)).toBeInTheDocument();
      });
    });

    test('toggles security settings', async () => {
      api.get.mockResolvedValue({ data: { allowCopy: false } });

      render(<MockedSettings />);

      const securityTab = screen.getByText(/Security/i);
      fireEvent.click(securityTab);

      await waitFor(() => {
        const checkbox = screen.getByLabelText(/Allow Copy \(Ctrl\+C\)/i);
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
      });
    });
  });

  describe('Save and Reset', () => {
    test('disables save button while saving', async () => {
      api.get.mockResolvedValue({ data: {} });
      api.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<MockedSettings />);

      await waitFor(() => {
        const saveButton = screen.getByText(/Save Settings/i);
        fireEvent.click(saveButton);
        expect(saveButton).toBeDisabled();
      });
    });

    test('reset button reloads the page', async () => {
      api.get.mockResolvedValue({ data: {} });
      const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

      render(<MockedSettings />);

      await waitFor(() => {
        const resetButton = screen.getByText(/Reset/i);
        fireEvent.click(resetButton);
        expect(reloadSpy).toHaveBeenCalled();
      });

      reloadSpy.mockRestore();
    });
  });

  describe('Event Settings', () => {
    test('handles schedule settings', async () => {
      api.get.mockResolvedValue({ data: { hasSchedule: false } });

      render(<MockedSettings />);

      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);

      await waitFor(() => {
        const checkbox = screen.getByLabelText(/Enable Schedule/i);
        fireEvent.click(checkbox);
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/From Date & Time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/To Date & Time/i)).toBeInTheDocument();
      });
    });

    test('handles quiz attempts configuration', async () => {
      api.get.mockResolvedValue({ data: { maxQuizAttempts: 3 } });

      render(<MockedSettings />);

      const eventTab = screen.getByText(/Event Settings/i);
      fireEvent.click(eventTab);

      await waitFor(() => {
        const input = screen.getByLabelText(/Maximum Quiz Attempts/i);
        expect(input.value).toBe('3');
        fireEvent.change(input, { target: { value: '5' } });
        expect(input.value).toBe('5');
      });
    });
  });
});
