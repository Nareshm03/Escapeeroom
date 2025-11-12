import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard, SkeletonList } from '../components/SkeletonLoaders';
import { useToast } from '../utils/ToastContext';

/**
 * Example page demonstrating proper usage of all design system components
 * This serves as a reference implementation for developers
 */
const ComponentExample = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleLoadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Data loaded successfully!');
    }, 2000);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Form submitted successfully!');
    }, 1500);
  };

  const handleError = () => {
    toast.error('An error occurred. Please try again.');
  };

  const handleWarning = () => {
    toast.warning('Please review your input before submitting.');
  };

  return (
    <PageTransition>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 className="ds-heading-1">Component Usage Example</h1>
          <p className="ds-body" style={{ color: '#6b7280' }}>
            Reference implementation showing proper usage of design system components
          </p>
        </div>

        {/* Grid Layout Example */}
        <div className="grid" style={{ marginBottom: '32px' }}>
          <div className="grid-col-12 grid-col-md-6">
            <Card elevated>
              <CardHeader>
                <h3 className="ds-heading-3">User Information</h3>
                <p className="ds-body-sm" style={{ color: '#6b7280', marginTop: '8px' }}>
                  Manage your account details
                </p>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="ds-body-sm" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label className="ds-body-sm" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">Cancel</Button>
                <Button variant="primary" size="sm" loading={submitting} onClick={handleSubmit}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid-col-12 grid-col-md-6">
            <Card>
              <CardHeader>
                <h3 className="ds-heading-3">Quick Actions</h3>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button variant="primary" onClick={handleLoadData}>
                    Load Data
                  </Button>
                  <Button variant="success" onClick={() => toast.success('Success notification!')}>
                    Show Success
                  </Button>
                  <Button variant="warning" onClick={handleWarning}>
                    Show Warning
                  </Button>
                  <Button variant="danger" onClick={handleError}>
                    Show Error
                  </Button>
                  <Button variant="outline">
                    Outline Button
                  </Button>
                  <Button variant="ghost">
                    Ghost Button
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Loading State Example */}
        <Card style={{ marginBottom: '32px' }}>
          <CardHeader>
            <h3 className="ds-heading-3">Loading States</h3>
            <p className="ds-body-sm" style={{ color: '#6b7280', marginTop: '8px' }}>
              Skeleton loaders prevent layout shift during data fetching
            </p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                <Card hoverable>
                  <CardBody>
                    <h4 className="ds-heading-4">Data Item 1</h4>
                    <p className="ds-body">This is the actual content that appears after loading.</p>
                  </CardBody>
                </Card>
                <Card hoverable>
                  <CardBody>
                    <h4 className="ds-heading-4">Data Item 2</h4>
                    <p className="ds-body">Click "Load Data" to see the skeleton loader.</p>
                  </CardBody>
                </Card>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Typography Example */}
        <Card style={{ marginBottom: '32px' }}>
          <CardHeader>
            <h3 className="ds-heading-3">Typography Hierarchy</h3>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h1 className="ds-heading-1">Heading 1</h1>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-heading-1"
                </code>
              </div>
              <div>
                <h2 className="ds-heading-2">Heading 2</h2>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-heading-2"
                </code>
              </div>
              <div>
                <h3 className="ds-heading-3">Heading 3</h3>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-heading-3"
                </code>
              </div>
              <div>
                <h4 className="ds-heading-4">Heading 4</h4>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-heading-4"
                </code>
              </div>
              <div>
                <p className="ds-body">Body text - Regular paragraph content</p>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-body"
                </code>
              </div>
              <div>
                <p className="ds-body-sm">Small body text - Secondary information</p>
                <code className="ds-body-sm" style={{ color: '#6b7280' }}>
                  className="ds-body-sm"
                </code>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Button Variants */}
        <Card style={{ marginBottom: '32px' }}>
          <CardHeader>
            <h3 className="ds-heading-3">Button Variants & Sizes</h3>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 className="ds-heading-4" style={{ marginBottom: '12px' }}>Variants</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <h4 className="ds-heading-4" style={{ marginBottom: '12px' }}>Sizes</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h4 className="ds-heading-4" style={{ marginBottom: '12px' }}>States</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" icon="✓">With Icon</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* List Example with Skeleton */}
        <Card>
          <CardHeader>
            <h3 className="ds-heading-3">List with Loading State</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <SkeletonList items={5} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3, 4, 5].map(item => (
                  <div 
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {item}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 className="ds-heading-4" style={{ marginBottom: '4px' }}>
                        List Item {item}
                      </h4>
                      <p className="ds-body-sm" style={{ color: '#6b7280' }}>
                        Description for item {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ComponentExample;
