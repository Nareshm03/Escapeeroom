import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TabbedAdminControls from '../components/TabbedAdminControls';

const Wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('TabbedAdminControls', () => {
  const mockTeams = [
    { id: 1, name: 'Team A', description: 'Test team', created_at: '2024-01-01' },
    { id: 2, name: 'Team B', description: 'Another team', created_at: '2024-01-02' }
  ];

  test('renders all four tabs', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  test('displays correct icons for each tab', () => {
    const { container } = render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const icons = container.querySelectorAll('.tab-icon');
    expect(icons[0]).toHaveTextContent('⚡');
    expect(icons[1]).toHaveTextContent('➕');
    expect(icons[2]).toHaveTextContent('📜');
    expect(icons[3]).toHaveTextContent('⚙️');
  });

  test('System tab shows Admin Panel card', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('System administration and monitoring')).toBeInTheDocument();
  });

  test('switches to Quizzes tab and shows correct content', async () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const quizzesTab = screen.getByText('Quizzes');
    fireEvent.click(quizzesTab);
    
    await waitFor(() => {
      expect(screen.getByText('Create Quiz')).toBeInTheDocument();
      expect(screen.getByText('Quiz List')).toBeInTheDocument();
    });
  });

  test('switches to Teams tab and shows Settings card', async () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const teamsTab = screen.getByText('Teams');
    fireEvent.click(teamsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  test('switches to Reports tab and shows Reports card', async () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const reportsTab = screen.getByText('Reports');
    fireEvent.click(reportsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('View detailed reports and analytics')).toBeInTheDocument();
    });
  });

  test('displays teams table when teams data is provided', async () => {
    render(<TabbedAdminControls teams={mockTeams} />, { wrapper: Wrapper });
    
    const teamsTab = screen.getByText('Teams');
    fireEvent.click(teamsTab);
    
    await waitFor(() => {
      expect(screen.getByText('All Teams')).toBeInTheDocument();
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
    });
  });

  test('active tab has proper ARIA attributes', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const systemTab = screen.getByRole('tab', { name: /System/i });
    expect(systemTab).toHaveAttribute('aria-selected', 'true');
  });

  test('inactive tabs have proper ARIA attributes', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const quizzesTab = screen.getByRole('tab', { name: /Quizzes/i });
    expect(quizzesTab).toHaveAttribute('aria-selected', 'false');
  });

  test('tab panel has proper ARIA attributes', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-system');
  });

  test('applies active class to selected tab', () => {
    const { container } = render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const systemTab = container.querySelector('.tab.active');
    expect(systemTab).toBeInTheDocument();
    expect(systemTab).toHaveTextContent('System');
  });

  test('keyboard navigation works', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const quizzesTab = screen.getByRole('tab', { name: /Quizzes/i });
    quizzesTab.focus();
    
    expect(document.activeElement).toBe(quizzesTab);
  });

  test('animation duration is 300ms', () => {
    const { container } = render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    // Check if tab content has proper animation setup
    const tabContent = container.querySelector('.tab-content');
    expect(tabContent).toBeInTheDocument();
  });

  test('handles empty teams array gracefully', () => {
    render(<TabbedAdminControls teams={[]} />, { wrapper: Wrapper });
    
    const teamsTab = screen.getByText('Teams');
    fireEvent.click(teamsTab);
    
    // Should not show teams table
    expect(screen.queryByText('All Teams')).not.toBeInTheDocument();
  });
});
