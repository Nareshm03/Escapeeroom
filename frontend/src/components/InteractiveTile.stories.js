import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import InteractiveTile from './InteractiveTile';

export default {
  title: 'Components/InteractiveTile',
  component: InteractiveTile,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ padding: '24px', background: 'var(--gradient-bg)', minHeight: '100vh' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    to: { control: 'text' },
  },
};

const Template = (args) => <InteractiveTile {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: '👥',
  title: 'Manage Teams',
  subtitle: 'Create and organize teams',
  to: '/teams',
};

export const WithoutSubtitle = Template.bind({});
WithoutSubtitle.args = {
  icon: '🎮',
  title: 'Play Game',
  to: '/game',
};

export const AsButton = Template.bind({});
AsButton.args = {
  icon: '⚙️',
  title: 'Settings',
  subtitle: 'Configure preferences',
  onClick: () => alert('Settings clicked!'),
};

export const LongText = Template.bind({});
LongText.args = {
  icon: '📊',
  title: 'View Detailed Analytics Report',
  subtitle: 'Comprehensive data analysis and insights',
  to: '/analytics',
};

export const MultipleCards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', maxWidth: '1200px' }}>
    <InteractiveTile
      icon="👥"
      title="Manage Teams"
      subtitle="Create and organize"
      to="/teams"
    />
    <InteractiveTile
      icon="🎮"
      title="Play Game"
      subtitle="Start session"
      to="/game"
    />
    <InteractiveTile
      icon="📊"
      title="View Results"
      subtitle="Analytics dashboard"
      to="/results"
    />
    <InteractiveTile
      icon="🏆"
      title="Live Board"
      subtitle="Real-time rankings"
      to="/live"
    />
  </div>
);

export const DarkTheme = () => {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <InteractiveTile
        icon="🌙"
        title="Dark Mode"
        subtitle="Theme enabled"
        to="/settings"
      />
      <InteractiveTile
        icon="⭐"
        title="Featured"
        subtitle="Top content"
        to="/featured"
      />
    </div>
  );
};

export const LightTheme = () => {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <InteractiveTile
        icon="☀️"
        title="Light Mode"
        subtitle="Theme enabled"
        to="/settings"
      />
      <InteractiveTile
        icon="✨"
        title="Highlights"
        subtitle="Best picks"
        to="/highlights"
      />
    </div>
  );
};

export const ResponsiveGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
    {[
      { icon: '👥', title: 'Teams', subtitle: 'Manage groups' },
      { icon: '🎮', title: 'Game', subtitle: 'Play now' },
      { icon: '📊', title: 'Results', subtitle: 'View stats' },
      { icon: '🏆', title: 'Leaderboard', subtitle: 'Rankings' },
      { icon: '⚙️', title: 'Settings', subtitle: 'Configure' },
      { icon: '📝', title: 'Create', subtitle: 'New quiz' },
    ].map((item, i) => (
      <InteractiveTile
        key={i}
        icon={item.icon}
        title={item.title}
        subtitle={item.subtitle}
        to={`/${item.title.toLowerCase()}`}
      />
    ))}
  </div>
);
