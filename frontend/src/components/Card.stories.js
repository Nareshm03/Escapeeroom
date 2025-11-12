import React from 'react';
import Card, { CardHeader, CardBody, CardFooter } from './Card';
import Button from './Button';

export default {
  title: 'Design System/Card',
  component: Card,
  argTypes: {
    elevated: { control: 'boolean' },
    hoverable: { control: 'boolean' }
  }
};

const Template = (args) => <Card {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <CardHeader>
        <h3 style={{ margin: 0 }}>Card Title</h3>
      </CardHeader>
      <CardBody>
        <p>This is a basic card with header and body content.</p>
      </CardBody>
    </>
  )
};

export const Elevated = Template.bind({});
Elevated.args = {
  elevated: true,
  children: (
    <>
      <CardHeader>
        <h3 style={{ margin: 0 }}>Elevated Card</h3>
      </CardHeader>
      <CardBody>
        <p>This card has an elevated shadow for emphasis.</p>
      </CardBody>
    </>
  )
};

export const Hoverable = Template.bind({});
Hoverable.args = {
  hoverable: true,
  children: (
    <>
      <CardHeader>
        <h3 style={{ margin: 0 }}>Hoverable Card</h3>
      </CardHeader>
      <CardBody>
        <p>Hover over this card to see the interactive effect.</p>
      </CardBody>
    </>
  )
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  children: (
    <>
      <CardHeader>
        <h3 style={{ margin: 0 }}>Card with Footer</h3>
      </CardHeader>
      <CardBody>
        <p>This card includes a footer with action buttons.</p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Save</Button>
      </CardFooter>
    </>
  )
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
  elevated: true,
  hoverable: true,
  children: (
    <>
      <CardHeader>
        <h3 style={{ margin: 0 }}>Complete Card Example</h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
          Subtitle or description
        </p>
      </CardHeader>
      <CardBody>
        <p>This is a complete card example with all sections.</p>
        <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">Learn More</Button>
        <Button variant="primary" size="sm">Get Started</Button>
      </CardFooter>
    </>
  )
};

export const CardGrid = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    padding: '20px'
  }}>
    <Card>
      <CardHeader>
        <h4 style={{ margin: 0 }}>Card 1</h4>
      </CardHeader>
      <CardBody>
        <p>First card in the grid</p>
      </CardBody>
    </Card>
    <Card elevated>
      <CardHeader>
        <h4 style={{ margin: 0 }}>Card 2</h4>
      </CardHeader>
      <CardBody>
        <p>Second card with elevation</p>
      </CardBody>
    </Card>
    <Card hoverable>
      <CardHeader>
        <h4 style={{ margin: 0 }}>Card 3</h4>
      </CardHeader>
      <CardBody>
        <p>Third card with hover effect</p>
      </CardBody>
    </Card>
  </div>
);
