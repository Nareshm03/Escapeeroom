import React from 'react';
import Button from './Button';

export default {
  title: 'Design System/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' }
  }
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
  size: 'md'
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
  size: 'md'
};

export const Success = Template.bind({});
Success.args = {
  children: 'Success Button',
  variant: 'success',
  size: 'md'
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Danger Button',
  variant: 'danger',
  size: 'md'
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Warning Button',
  variant: 'warning',
  size: 'md'
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline Button',
  variant: 'outline',
  size: 'md'
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: 'Ghost Button',
  variant: 'ghost',
  size: 'md'
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small Button',
  variant: 'primary',
  size: 'sm'
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large Button',
  variant: 'primary',
  size: 'lg'
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  variant: 'primary',
  size: 'md',
  disabled: true
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Loading Button',
  variant: 'primary',
  size: 'md',
  loading: true
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: 'Button with Icon',
  variant: 'primary',
  size: 'md',
  icon: '✓'
};

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" icon="✓">With Icon</Button>
    </div>
  </div>
);
