import React from 'react';
import StatCard from './StatCard';

export default {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    icon: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
    trend: { control: 'object' },
    sparkline: { control: 'array' },
  },
};

const Template = (args) => <StatCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: '👥',
  label: 'Total Users',
  value: '1,234',
  trend: { direction: '+', amount: '12%' },
  sparkline: [10, 15, 13, 18, 22, 20, 25],
};

export const NegativeTrend = Template.bind({});
NegativeTrend.args = {
  icon: '📉',
  label: 'Active Sessions',
  value: '456',
  trend: { direction: '-', amount: '5%' },
  sparkline: [25, 23, 20, 18, 15, 14, 12],
};

export const WithoutTrend = Template.bind({});
WithoutTrend.args = {
  icon: '⭐',
  label: 'Average Rating',
  value: '4.8',
  sparkline: [4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.8],
};

export const WithoutSparkline = Template.bind({});
WithoutSparkline.args = {
  icon: '🎯',
  label: 'Completion Rate',
  value: '87%',
  trend: { direction: '+', amount: '3%' },
};

export const MinimalCard = Template.bind({});
MinimalCard.args = {
  icon: '💰',
  label: 'Revenue',
  value: '$12,345',
};

export const LargeNumbers = Template.bind({});
LargeNumbers.args = {
  icon: '🚀',
  label: 'Total Downloads',
  value: '1.2M',
  trend: { direction: '+', amount: '234K' },
  sparkline: [800000, 850000, 900000, 1000000, 1100000, 1150000, 1200000],
};

export const MultipleCards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
    <StatCard
      icon="👥"
      label="Total Teams"
      value="24"
      trend={{ direction: '+', amount: '3' }}
      sparkline={[18, 19, 20, 21, 22, 23, 24]}
    />
    <StatCard
      icon="🎮"
      label="Active Games"
      value="8"
      trend={{ direction: '+', amount: '2' }}
      sparkline={[5, 6, 6, 7, 7, 8, 8]}
    />
    <StatCard
      icon="🏁"
      label="Completed"
      value="156"
      trend={{ direction: '-', amount: '4' }}
      sparkline={[165, 163, 160, 158, 157, 156, 156]}
    />
    <StatCard
      icon="⭐"
      label="Avg Score"
      value="92%"
      trend={{ direction: '+', amount: '5%' }}
      sparkline={[85, 87, 88, 89, 90, 91, 92]}
    />
  </div>
);
