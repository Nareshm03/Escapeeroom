import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusIndicator from '../components/StatusIndicator';

describe('StatusIndicator', () => {
  const defaultProps = {
    icon: '🕒',
    label: 'Time Limit',
    value: '60m',
    status: 'active',
    lastUpdated: Date.now()
  };

  test('renders icon and value', () => {
    render(<StatusIndicator {...defaultProps} />);
    expect(screen.getByText('🕒')).toBeInTheDocument();
    expect(screen.getByText('60m')).toBeInTheDocument();
  });

  test('shows tooltip on hover', async () => {
    render(<StatusIndicator {...defaultProps} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.mouseEnter(indicator);
    
    await waitFor(() => {
      expect(screen.getByText('Time Limit')).toBeInTheDocument();
      expect(screen.getByText(/Status:/)).toBeInTheDocument();
    });
  });

  test('hides tooltip after 3 seconds', async () => {
    jest.useFakeTimers();
    render(<StatusIndicator {...defaultProps} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.mouseEnter(indicator);
    
    await waitFor(() => {
      expect(screen.getByText('Time Limit')).toBeInTheDocument();
    });
    
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(screen.queryByText('Time Limit')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('displays correct color for active status', () => {
    const { container } = render(<StatusIndicator {...defaultProps} status="active" />);
    const valueElement = container.querySelector('.status-value');
    expect(valueElement).toHaveStyle({ color: 'var(--secondary)' });
  });

  test('displays correct color for inactive status', () => {
    const { container } = render(<StatusIndicator {...defaultProps} status="inactive" />);
    const valueElement = container.querySelector('.status-value');
    expect(valueElement).toHaveStyle({ color: 'rgba(255, 255, 255, 0.4)' });
  });

  test('calls onQuickAction when button clicked', async () => {
    const mockAction = jest.fn();
    render(<StatusIndicator {...defaultProps} onQuickAction={mockAction} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.mouseEnter(indicator);
    
    await waitFor(() => {
      const button = screen.getByText('Quick Action');
      fireEvent.click(button);
    });
    
    expect(mockAction).toHaveBeenCalled();
  });

  test('formats timestamp correctly', async () => {
    const oneMinuteAgo = Date.now() - 60000;
    render(<StatusIndicator {...defaultProps} lastUpdated={oneMinuteAgo} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.mouseEnter(indicator);
    
    await waitFor(() => {
      expect(screen.getByText(/1m ago/)).toBeInTheDocument();
    });
  });

  test('handles touch events', async () => {
    render(<StatusIndicator {...defaultProps} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.touchStart(indicator);
    
    await waitFor(() => {
      expect(screen.getByText('Time Limit')).toBeInTheDocument();
    });
  });

  test('renders without quick action button', async () => {
    render(<StatusIndicator {...defaultProps} />);
    
    const indicator = screen.getByText('🕒').parentElement;
    fireEvent.mouseEnter(indicator);
    
    await waitFor(() => {
      expect(screen.queryByText('Quick Action')).not.toBeInTheDocument();
    });
  });
});
