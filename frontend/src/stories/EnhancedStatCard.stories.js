import React from 'react';
import EnhancedStatCard from '../components/EnhancedStatCard';
import '../styles/EnhancedStatCard.css';

export default {
  title: 'Components/EnhancedStatCard',
  component: EnhancedStatCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    icon: { control: 'text' },
    value: { control: 'number' },
    label: { control: 'text' },
    trend: { control: 'number' },
    color: { control: 'color' },
    isPercentage: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

const Template = (args) => <EnhancedStatCard {...args} />;

export const TotalTeams = Template.bind({});
TotalTeams.args = {
  icon: '👥',
  value: 42,
  label: 'Total Teams',
  trend: 3,
  color: '#667eea',
  loading: false,
};

export const ActiveGames = Template.bind({});
ActiveGames.args = {
  icon: '🎮',
  value: 8,
  label: 'Active Games',
  trend: 1,
  color: '#f093fb',
  loading: false,
};

export const CompletedGames = Template.bind({});
CompletedGames.args = {
  icon: '🏁',
  value: 156,
  label: 'Completed',
  trend: -2,
  color: '#4facfe',
  loading: false,
};

export const AverageScore = Template.bind({});
AverageScore.args = {
  icon: '⭐',
  value: 87.5,
  label: 'Avg Score',
  trend: 5,
  color: '#43e97b',
  isPercentage: true,
  loading: false,
};

export const LargeNumber = Template.bind({});
LargeNumber.args = {
  icon: '📊',
  value: 12345,
  label: 'Total Users',
  trend: 234,
  color: '#667eea',
  loading: false,
};

export const NegativeTrend = Template.bind({});
NegativeTrend.args = {
  icon: '📉',
  value: 45,
  label: 'Pending Tasks',
  trend: -12,
  color: '#ef4444',
  loading: false,
};

export const NoTrend = Template.bind({});
NoTrend.args = {
  icon: '📌',
  value: 100,
  label: 'Static Value',
  trend: 0,
  color: '#6b7280',
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  icon: '⏳',
  value: 0,
  label: 'Loading Data',
  trend: 0,
  color: '#667eea',
  loading: true,
};

export const AllVariants = () => (
  <div className="stats-grid" style={{ padding: '20px' }}>
    <EnhancedStatCard
      icon="👥"
      value={42}
      label="Total Teams"
      trend={3}
      color="#667eea"
    />
    <EnhancedStatCard
      icon="🎮"
      value={8}
      label="Active Games"
      trend={1}
      color="#f093fb"
    />
    <EnhancedStatCard
      icon="🏁"
      value={156}
      label="Completed"
      trend={-2}
      color="#4facfe"
    />
    <EnhancedStatCard
      icon="⭐"
      value={87.5}
      label="Avg Score"
      trend={5}
      color="#43e97b"
      isPercentage={true}
    />
  </div>
);

export const DarkMode = () => (
  <div data-theme="dark" style={{ background: '#111827', padding: '20px', minHeight: '300px' }}>
    <div className="stats-grid">
      <EnhancedStatCard
        icon="👥"
        value={42}
        label="Total Teams"
        trend={3}
        color="#667eea"
      />
      <EnhancedStatCard
        icon="🎮"
        value={8}
        label="Active Games"
        trend={1}
        color="#f093fb"
      />
    </div>
  </div>
);
