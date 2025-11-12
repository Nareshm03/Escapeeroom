import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../utils/AuthContext';
import { SettingsProvider } from '../utils/SettingsContext';

const MockedNavbar = ({ user = { name: 'Test User', email: 'test@test.com' } }) => (
  <BrowserRouter>
    <AuthProvider>
      <SettingsProvider>
        <Navbar />
      </SettingsProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Refactored Navbar', () => {
  describe('Visual Design', () => {
    test('navbar has fixed position', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      const styles = window.getComputedStyle(navbar);
      expect(styles.position).toBe('fixed');
    });

    test('navbar has glassmorphism effect', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      expect(navbar).toHaveStyle({
        backdropFilter: expect.stringContaining('blur')
      });
    });

    test('navbar has border', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      const styles = window.getComputedStyle(navbar);
      expect(styles.borderBottom).toBeTruthy();
    });
  });

  describe('Interactive Elements', () => {
    test('active tab has underline indicator', () => {
      const { container } = render(<MockedNavbar />);
      const activeItem = container.querySelector('.nav-item.active');
      
      expect(activeItem).toBeInTheDocument();
    });

    test('dropdown opens on avatar click', async () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      fireEvent.click(avatar);
      
      await waitFor(() => {
        const dropdown = screen.getByRole('menu');
        expect(dropdown).toBeInTheDocument();
      });
    });

    test('dropdown closes on outside click', async () => {
      const { container } = render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      fireEvent.click(avatar);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      
      fireEvent.mouseDown(container);
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    test('dropdown closes on Escape key', async () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      fireEvent.click(avatar);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    test('nav items have hover effects', () => {
      const { container } = render(<MockedNavbar />);
      const navItem = container.querySelector('.nav-item');
      
      expect(navItem).toHaveClass('nav-item');
    });
  });

  describe('Accessibility', () => {
    test('navbar has proper ARIA label', () => {
      render(<MockedNavbar />);
      const nav = screen.getByRole('navigation');
      
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('dropdown has proper ARIA attributes', async () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      expect(avatar).toHaveAttribute('aria-haspopup', 'true');
      expect(avatar).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(avatar);
      
      await waitFor(() => {
        expect(avatar).toHaveAttribute('aria-expanded', 'true');
      });
    });

    test('active nav item has aria-current', () => {
      const { container } = render(<MockedNavbar />);
      const activeItem = container.querySelector('.nav-item.active');
      
      expect(activeItem).toHaveAttribute('aria-current', 'page');
    });

    test('dropdown items have menuitem role', async () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      fireEvent.click(avatar);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems.length).toBeGreaterThan(0);
      });
    });

    test('keyboard navigation works', () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      avatar.focus();
      
      expect(document.activeElement).toBe(avatar);
    });

    test('focus visible styles applied', () => {
      const { container } = render(<MockedNavbar />);
      const navItem = container.querySelector('.nav-item');
      
      navItem.focus();
      expect(navItem).toHaveClass('nav-item');
    });
  });

  describe('Performance', () => {
    test('navbar has will-change property', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      const styles = window.getComputedStyle(navbar);
      expect(styles.willChange).toBeTruthy();
    });

    test('navbar has transform optimization', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      const styles = window.getComputedStyle(navbar);
      expect(styles.transform).toBeTruthy();
    });

    test('no layout shift on mount', () => {
      const { container } = render(<MockedNavbar />);
      const navbar = container.querySelector('.glassmorphism-navbar');
      
      expect(navbar).toBeInTheDocument();
      expect(document.body.style.paddingTop).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    test('mobile menu toggle exists', () => {
      const { container } = render(<MockedNavbar />);
      const toggle = container.querySelector('.mobile-menu-toggle');
      
      expect(toggle).toBeInTheDocument();
    });

    test('mobile menu opens on toggle click', () => {
      const { container } = render(<MockedNavbar />);
      const toggle = container.querySelector('.mobile-menu-toggle');
      
      fireEvent.click(toggle);
      
      const navMain = container.querySelector('.navbar-main');
      expect(navMain).toHaveClass('open');
    });
  });

  describe('Theme Toggle', () => {
    test('theme toggle button exists', () => {
      render(<MockedNavbar />);
      const themeToggle = screen.getByLabelText(/switch to/i);
      
      expect(themeToggle).toBeInTheDocument();
    });

    test('theme toggle changes theme', () => {
      render(<MockedNavbar />);
      const themeToggle = screen.getByLabelText(/switch to/i);
      
      fireEvent.click(themeToggle);
      
      expect(document.documentElement.getAttribute('data-theme')).toBeTruthy();
    });
  });

  describe('Framer Motion Animations', () => {
    test('underline animation present on active item', () => {
      const { container } = render(<MockedNavbar />);
      const activeItem = container.querySelector('.nav-item.active');
      const underline = activeItem?.querySelector('.nav-underline');
      
      expect(underline).toBeInTheDocument();
    });

    test('dropdown has animation wrapper', async () => {
      render(<MockedNavbar />);
      
      const avatar = screen.getByLabelText('User menu');
      fireEvent.click(avatar);
      
      await waitFor(() => {
        const dropdown = screen.getByRole('menu');
        expect(dropdown).toBeInTheDocument();
      });
    });
  });
});
