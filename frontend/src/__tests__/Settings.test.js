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

describe('Settings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: {} });
  });

  test('renders without crashing', async () => {
    render(<MockedSettings />);
    await waitFor(() => {
      expect(screen.getByText(/Application Settings/i)).toBeInTheDocument();
    });
  });

  test('displays all three main tabs', async () => {
    render(<MockedSettings />);
    await waitFor(() => {
      expect(screen.getByText(/General/i)).toBeInTheDocument();
      expect(screen.getByText(/Event Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Security/i)).toBeInTheDocument();
    });
  });

  test('switches between tabs', async () => {
    render(<MockedSettings />);
    await waitFor(() => {
      expect(screen.getByText(/General Settings/i)).toBeInTheDocument();
    });

    const eventTab = screen.getByText(/Event Settings/i);
    fireEvent.click(eventTab);
    
    await waitFor(() => {
      expect(screen.getByText(/Enable Global Time Limit/i)).toBeInTheDocument();
    });
  });

  test('handles input changes', async () => {
    render(<MockedSettings />);
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Enter application name/i);
      fireEvent.change(input, { target: { value: 'New App Name' } });
      expect(input.value).toBe('New App Name');
    });
  });

  test('saves settings successfully', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    render(<MockedSettings />);
    await waitFor(() => {
      const saveButton = screen.getByText(/Save Settings/i);
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/settings', expect.any(Object));
    });
  });

  test('displays security settings correctly', async () => {
    render(<MockedSettings />);
    
    const securityTab = screen.getByText(/Security/i);
    fireEvent.click(securityTab);

    await waitFor(() => {
      expect(screen.getByText(/Allow Copy \(Ctrl\+C\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Allow Paste \(Ctrl\+V\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Allow Right Click Context Menu/i)).toBeInTheDocument();
    });
  });

  test('toggles checkbox settings', async () => {
    render(<MockedSettings />);
    
    await waitFor(() => {
      const checkbox = screen.getByLabelText(/Show Application Name in Header/i);
      const initialState = checkbox.checked;
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(!initialState);
    });
  });

  test('shows time limit input when enabled', async () => {
    render(<MockedSettings />);
    
    const eventTab = screen.getByText(/Event Settings/i);
    fireEvent.click(eventTab);

    await waitFor(() => {
      const timeLimitCheckbox = screen.getByLabelText(/Enable Global Time Limit/i);
      if (!timeLimitCheckbox.checked) {
        fireEvent.click(timeLimitCheckbox);
      }
      expect(screen.getByText(/Global Time Limit \(minutes\)/i)).toBeInTheDocument();
    });
  });

  test('handles reset button click', async () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
    
    render(<MockedSettings />);
    
    await waitFor(() => {
      const resetButton = screen.getByText(/Reset/i);
      fireEvent.click(resetButton);
    });

    expect(reloadSpy).toHaveBeenCalled();
    reloadSpy.mockRestore();
  });
});
