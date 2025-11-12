import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import EnhancedNavbar from './EnhancedNavbar';
import { AuthProvider } from '../utils/AuthContext';

export default {
  title: 'Components/EnhancedNavbar',
  component: EnhancedNavbar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <EnhancedNavbar {...args} />;

export const Default = Template.bind({});
Default.args = {
  brandName: 'Escape Room',
};

export const CustomBrand = Template.bind({});
CustomBrand.args = {
  brandName: 'My Custom App',
};

export const WithUser = () => {
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-bg)' }}>
      <EnhancedNavbar brandName="Escape Room" />
      <div style={{ padding: '32px', color: 'var(--text-primary)' }}>
        <h1>Dashboard Content</h1>
        <p>Navigate between tabs to see the animated underline effect.</p>
      </div>
    </div>
  );
};

export const DarkTheme = () => {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-bg)' }}>
      <EnhancedNavbar brandName="Escape Room" />
      <div style={{ padding: '32px', color: 'var(--text-primary)' }}>
        <h1>Dark Theme</h1>
        <p>The navbar adapts to the dark theme automatically.</p>
      </div>
    </div>
  );
};

export const LightTheme = () => {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-bg)' }}>
      <EnhancedNavbar brandName="Escape Room" />
      <div style={{ padding: '32px', color: 'var(--text-primary)' }}>
        <h1>Light Theme</h1>
        <p>The navbar adapts to the light theme automatically.</p>
      </div>
    </div>
  );
};

export const MobileView = () => {
  return (
    <div style={{ maxWidth: '375px', minHeight: '100vh', background: 'var(--gradient-bg)' }}>
      <EnhancedNavbar brandName="Escape Room" />
      <div style={{ padding: '16px', color: 'var(--text-primary)' }}>
        <h2>Mobile View</h2>
        <p>Tab labels are hidden on mobile, showing only icons.</p>
      </div>
    </div>
  );
};
