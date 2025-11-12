import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../utils/AuthContext';
import { SettingsProvider } from '../utils/SettingsContext';

import App from '../App';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import Teams from '../pages/Teams';
import TabbedAdminControls from '../components/TabbedAdminControls';
import Modal from '../components/Modal';

expect.extend(toHaveNoViolations);

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Accessibility Tests', () => {
  test('App should not have accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Navbar should not have accessibility violations', async () => {
    const { container } = render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Dashboard should not have accessibility violations', async () => {
    const { container } = render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Teams page should not have accessibility violations', async () => {
    const { container } = render(
      <Wrapper>
        <Teams />
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('TabbedAdminControls should not have accessibility violations', async () => {
    const { container } = render(
      <Wrapper>
        <TabbedAdminControls teams={[]} />
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Modal should not have accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Modal has proper ARIA attributes', () => {
    const { getByRole } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    const dialog = getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  test('Skip link is present and functional', () => {
    const { container } = render(<App />);
    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent('Skip to main content');
  });

  test('Main landmark is properly labeled', () => {
    const { getByRole } = render(<App />);
    const main = getByRole('main');
    expect(main).toHaveAttribute('aria-label', 'Main content');
  });
});
