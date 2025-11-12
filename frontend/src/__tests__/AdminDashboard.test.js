import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/api', () => ({
  get: jest.fn((url) => {
    if (url === '/admin/teams') {
      return Promise.resolve({ data: [
        { id: 1, name: 'Alpha', description: 'First team', created_at: new Date().toISOString() },
        { id: 2, name: 'Beta', description: 'Second team', created_at: new Date().toISOString() }
      ] });
    }
    if (url === '/api/teams') {
      return Promise.resolve({ data: [ { id: 1 }, { id: 2 }, { id: 3 } ] });
    }
    if (url === '/api/leaderboard') {
      return Promise.resolve({ data: [ { percentage: 80 }, { percentage: 60 } ] });
    }
    if (url === '/api/quiz') {
      return Promise.resolve({ data: [ { is_published: true }, { is_published: false } ] });
    }
    return Promise.resolve({ data: [] });
  })
}));

import AdminDashboard from '../pages/AdminDashboard';

describe('AdminDashboard visual regression', () => {
  test('renders header and sections', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Header
    expect(screen.getByText(/Welcome back, Admin!/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick overview and controls/i)).toBeInTheDocument();

    // Section titles
    expect(screen.getByText(/🚀 Quick Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/🔒 Admin Controls/i)).toBeInTheDocument();

    // Teams table caption appears after data loads
    expect(await screen.findByText(/List of all teams/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  test('shows stat cards and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Titles render immediately; values update after fetch
    const statRegions = await screen.findAllByRole('region', { name: /statistic/i });
    expect(statRegions.length).toBe(4);

    // Values based on mocks
    // Basic structure snapshot
    expect(asFragment()).toMatchSnapshot();

    // Snapshot of the rendered structure
    expect(asFragment()).toMatchSnapshot();
  });
});