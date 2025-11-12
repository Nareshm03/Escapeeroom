import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard, SkeletonList, SkeletonText, SkeletonTable } from '../components/SkeletonLoaders';
import { useToast } from '../utils/ToastContext';
import './DesignSystem.css';

const DesignSystem = () => {
  const [showSkeletons, setShowSkeletons] = useState(false);
  const toast = useToast();

  const colorTokens = [
    { name: 'Primary', var: '--ds-primary', value: '#667eea' },
    { name: 'Success', var: '--ds-success', value: '#48bb78' },
    { name: 'Warning', var: '--ds-warning', value: '#ed8936' },
    { name: 'Danger', var: '--ds-danger', value: '#f56565' },
    { name: 'Info', var: '--ds-info', value: '#4299e1' }
  ];

  const spacingTokens = [
    { name: 'Space 1', var: '--ds-space-1', value: '4px' },
    { name: 'Space 2', var: '--ds-space-2', value: '8px' },
    { name: 'Space 4', var: '--ds-space-4', value: '16px' },
    { name: 'Space 6', var: '--ds-space-6', value: '24px' },
    { name: 'Space 8', var: '--ds-space-8', value: '32px' }
  ];

  const shadowTokens = [
    { name: 'Shadow SM', var: '--ds-shadow-sm' },
    { name: 'Shadow MD', var: '--ds-shadow-md' },
    { name: 'Shadow LG', var: '--ds-shadow-lg' },
    { name: 'Shadow XL', var: '--ds-shadow-xl' }
  ];

  return (
    <PageTransition>
      <div className="container">
        <div className="ds-page-header">
          <h1 className="ds-heading-1">Design System</h1>
          <p className="ds-body">
            Comprehensive UI/UX standards and reusable components for the Escape Room App
          </p>
        </div>

        {/* Color Tokens */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Color Tokens</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-color-grid">
              {colorTokens.map(token => (
                <div key={token.var} className="ds-color-item">
                  <div 
                    className="ds-color-swatch" 
                    style={{ background: token.value }}
                  ></div>
                  <div className="ds-color-info">
                    <div className="ds-body-sm" style={{ fontWeight: 600 }}>{token.name}</div>
                    <div className="ds-body-sm" style={{ color: '#6b7280' }}>{token.value}</div>
                    <code className="ds-code">{token.var}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Typography */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Typography</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-typography-showcase">
              <h1 className="ds-heading-1">Heading 1 - 36px Bold</h1>
              <h2 className="ds-heading-2">Heading 2 - 30px Semibold</h2>
              <h3 className="ds-heading-3">Heading 3 - 24px Semibold</h3>
              <h4 className="ds-heading-4">Heading 4 - 20px Medium</h4>
              <p className="ds-body">Body Text - 16px Normal</p>
              <p className="ds-body-sm">Small Body Text - 14px Normal</p>
            </div>
          </CardBody>
        </Card>

        {/* Spacing */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Spacing Scale (8px base)</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-spacing-showcase">
              {spacingTokens.map(token => (
                <div key={token.var} className="ds-spacing-item">
                  <div 
                    className="ds-spacing-bar" 
                    style={{ width: token.value }}
                  ></div>
                  <div className="ds-spacing-info">
                    <span className="ds-body-sm" style={{ fontWeight: 600 }}>{token.name}</span>
                    <span className="ds-body-sm" style={{ color: '#6b7280' }}>{token.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Shadows */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Shadow Elevation</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-shadow-grid">
              {shadowTokens.map(token => (
                <div key={token.var} className="ds-shadow-item">
                  <div 
                    className="ds-shadow-box" 
                    style={{ boxShadow: `var(${token.var})` }}
                  ></div>
                  <div className="ds-body-sm" style={{ fontWeight: 600, marginTop: '12px' }}>
                    {token.name}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Buttons */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Buttons</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-button-showcase">
              <div className="ds-button-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
              </div>
              <div className="ds-button-row">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
              </div>
              <div className="ds-button-row">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cards */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Cards</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-card-showcase">
              <Card>
                <CardHeader>
                  <h4 className="ds-heading-4">Standard Card</h4>
                </CardHeader>
                <CardBody>
                  <p className="ds-body">This is a standard card with header and body.</p>
                </CardBody>
              </Card>
              
              <Card elevated>
                <CardHeader>
                  <h4 className="ds-heading-4">Elevated Card</h4>
                </CardHeader>
                <CardBody>
                  <p className="ds-body">This card has elevated shadow.</p>
                </CardBody>
              </Card>
              
              <Card hoverable>
                <CardHeader>
                  <h4 className="ds-heading-4">Hoverable Card</h4>
                </CardHeader>
                <CardBody>
                  <p className="ds-body">Hover over this card to see the effect.</p>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>

        {/* Skeleton Loaders */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Skeleton Loaders</h2>
          </CardHeader>
          <CardBody>
            <Button 
              variant="secondary" 
              onClick={() => setShowSkeletons(!showSkeletons)}
              style={{ marginBottom: '24px' }}
            >
              {showSkeletons ? 'Hide' : 'Show'} Skeletons
            </Button>
            
            {showSkeletons && (
              <div className="ds-skeleton-showcase">
                <div>
                  <h4 className="ds-heading-4" style={{ marginBottom: '16px' }}>Card Skeleton</h4>
                  <SkeletonCard />
                </div>
                <div>
                  <h4 className="ds-heading-4" style={{ marginBottom: '16px' }}>List Skeleton</h4>
                  <SkeletonList items={3} />
                </div>
                <div>
                  <h4 className="ds-heading-4" style={{ marginBottom: '16px' }}>Text Skeleton</h4>
                  <SkeletonText lines={4} />
                </div>
                <div>
                  <h4 className="ds-heading-4" style={{ marginBottom: '16px' }}>Table Skeleton</h4>
                  <SkeletonTable rows={3} columns={3} />
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Toast Notifications */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">Toast Notifications</h2>
          </CardHeader>
          <CardBody>
            <div className="ds-button-row">
              <Button 
                variant="success" 
                onClick={() => toast.success('Success! Operation completed.')}
              >
                Show Success
              </Button>
              <Button 
                variant="danger" 
                onClick={() => toast.error('Error! Something went wrong.')}
              >
                Show Error
              </Button>
              <Button 
                variant="warning" 
                onClick={() => toast.warning('Warning! Please check your input.')}
              >
                Show Warning
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Grid System */}
        <Card className="mb-lg">
          <CardHeader>
            <h2 className="ds-heading-3">12-Column Grid System</h2>
          </CardHeader>
          <CardBody>
            <div className="grid">
              <div className="grid-col-12 ds-grid-demo">12 columns</div>
              <div className="grid-col-6 ds-grid-demo">6 columns</div>
              <div className="grid-col-6 ds-grid-demo">6 columns</div>
              <div className="grid-col-4 ds-grid-demo">4 columns</div>
              <div className="grid-col-4 ds-grid-demo">4 columns</div>
              <div className="grid-col-4 ds-grid-demo">4 columns</div>
              <div className="grid-col-3 ds-grid-demo">3 columns</div>
              <div className="grid-col-3 ds-grid-demo">3 columns</div>
              <div className="grid-col-3 ds-grid-demo">3 columns</div>
              <div className="grid-col-3 ds-grid-demo">3 columns</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageTransition>
  );
};

export default DesignSystem;
