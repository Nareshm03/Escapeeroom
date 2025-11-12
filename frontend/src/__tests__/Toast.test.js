import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../utils/ToastContext';
import Toast from '../components/Toast';

// Test component to trigger toasts
const TestComponent = () => {
  const toast = useToast();
  
  return (
    <div>
      <button onClick={() => toast.success('Success message')}>Success</button>
      <button onClick={() => toast.error('Error message')}>Error</button>
      <button onClick={() => toast.warning('Warning message')}>Warning</button>
    </div>
  );
};

describe('Toast Notifications', () => {
  describe('Toast Component', () => {
    test('renders success toast with correct styling', () => {
      const onClose = jest.fn();
      render(<Toast type="success" message="Test success" onClose={onClose} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast-success');
      expect(screen.getByText('Test success')).toBeInTheDocument();
    });

    test('renders error toast with correct styling', () => {
      const onClose = jest.fn();
      render(<Toast type="error" message="Test error" onClose={onClose} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast-error');
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    test('renders warning toast with correct styling', () => {
      const onClose = jest.fn();
      render(<Toast type="warning" message="Test warning" onClose={onClose} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('toast-warning');
      expect(screen.getByText('Test warning')).toBeInTheDocument();
    });

    test('has proper ARIA attributes', () => {
      const onClose = jest.fn();
      render(<Toast type="success" message="Test" onClose={onClose} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
      expect(toast).toHaveAttribute('aria-label', 'Success notification');
    });

    test('error toast has assertive aria-live', () => {
      const onClose = jest.fn();
      render(<Toast type="error" message="Test" onClose={onClose} />);
      
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
    });

    test('close button has proper aria-label', () => {
      const onClose = jest.fn();
      render(<Toast type="success" message="Test" onClose={onClose} />);
      
      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });

    test('calls onClose when close button clicked', () => {
      const onClose = jest.fn();
      render(<Toast type="success" message="Test" onClose={onClose} />);
      
      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('auto-dismisses success toast after duration', async () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      
      render(<Toast type="success" message="Test" onClose={onClose} duration={1000} />);
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
      
      jest.useRealTimers();
    });

    test('error toast does not auto-dismiss', async () => {
      jest.useFakeTimers();
      const onClose = jest.fn();
      
      render(<Toast type="error" message="Test" onClose={onClose} duration={0} />);
      
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      expect(onClose).not.toHaveBeenCalled();
      
      jest.useRealTimers();
    });

    test('close button is keyboard accessible', () => {
      const onClose = jest.fn();
      render(<Toast type="success" message="Test" onClose={onClose} />);
      
      const closeButton = screen.getByLabelText('Close notification');
      closeButton.focus();
      
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('ToastProvider', () => {
    test('provides toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    test('displays success toast when triggered', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      const successButton = screen.getByText('Success');
      fireEvent.click(successButton);
      
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });
    });

    test('displays error toast when triggered', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      const errorButton = screen.getByText('Error');
      fireEvent.click(errorButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });
    });

    test('displays warning toast when triggered', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      const warningButton = screen.getByText('Warning');
      fireEvent.click(warningButton);
      
      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });
    });

    test('can display multiple toasts simultaneously', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      fireEvent.click(screen.getByText('Success'));
      fireEvent.click(screen.getByText('Error'));
      
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });
    });

    test('removes toast when closed', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      fireEvent.click(screen.getByText('Success'));
      
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('toast container has aria-live region', () => {
      const { container } = render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      const toastContainer = container.querySelector('.toast-container');
      expect(toastContainer).toHaveAttribute('aria-live', 'polite');
      expect(toastContainer).toHaveAttribute('aria-atomic', 'false');
    });

    test('focus management works correctly', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      
      fireEvent.click(screen.getByText('Success'));
      
      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close notification');
        closeButton.focus();
        expect(document.activeElement).toBe(closeButton);
      });
    });
  });
});
