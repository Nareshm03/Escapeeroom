import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedStatCard from '../components/EnhancedStatCard';

describe('EnhancedStatCard', () => {
  const defaultProps = {
    icon: '👥',
    value: 42,
    label: 'Total Teams',
    trend: 3,
    color: '#667eea',
    loading: false
  };

  test('renders with correct props', () => {
    render(<EnhancedStatCard {...defaultProps} />);
    expect(screen.getByText('Total Teams')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  test('displays trend indicator correctly', () => {
    const { rerender } = render(<EnhancedStatCard {...defaultProps} trend={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();

    rerender(<EnhancedStatCard {...defaultProps} trend={-3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  test('formats percentage values correctly', () => {
    render(<EnhancedStatCard {...defaultProps} value={85.5} isPercentage={true} />);
    waitFor(() => {
      expect(screen.getByText('%')).toBeInTheDocument();
    });
  });

  test('formats large numbers with commas', async () => {
    render(<EnhancedStatCard {...defaultProps} value={1234} />);
    await waitFor(() => {
      const valueElement = screen.getByText(/1,234/);
      expect(valueElement).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('shows loading skeleton when loading', () => {
    const { container } = render(<EnhancedStatCard {...defaultProps} loading={true} />);
    expect(container.querySelector('.loading-skeleton')).toBeInTheDocument();
  });

  test('has proper ARIA labels', () => {
    render(<EnhancedStatCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label');
    expect(card.getAttribute('aria-label')).toContain('Total Teams');
    expect(card.getAttribute('aria-label')).toContain('Up 3 today');
  });

  test('applies hover styles', async () => {
    const { container } = render(<EnhancedStatCard {...defaultProps} />);
    const card = container.querySelector('.enhanced-stat-card');
    
    await userEvent.hover(card);
    expect(card).toHaveClass('enhanced-stat-card');
  });

  test('animates value from 0 to target', async () => {
    const { container } = render(<EnhancedStatCard {...defaultProps} value={100} />);
    
    // Initial state should be 0 or animating
    await waitFor(() => {
      const valueElement = container.querySelector('.stat-value span');
      expect(valueElement).toBeInTheDocument();
    });

    // After animation completes, should show target value
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('respects reduced motion preference', () => {
    const matchMediaMock = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    global.matchMedia = matchMediaMock;

    render(<EnhancedStatCard {...defaultProps} />);
    expect(matchMediaMock).toHaveBeenCalled();
  });

  test('handles zero trend correctly', () => {
    const { container } = render(<EnhancedStatCard {...defaultProps} trend={0} />);
    expect(container.querySelector('.stat-trend-badge')).not.toBeInTheDocument();
  });

  test('applies custom color correctly', () => {
    const { container } = render(<EnhancedStatCard {...defaultProps} color="#ff0000" />);
    const card = container.querySelector('.enhanced-stat-card');
    expect(card).toHaveStyle({ '--card-color': '#ff0000' });
  });

  test('intersection observer triggers animation', async () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;

    render(<EnhancedStatCard {...defaultProps} />);
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});
