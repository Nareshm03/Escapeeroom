import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to monitoring service (e.g., Sentry, CloudWatch)
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              We encountered an unexpected error. Don't worry, your data is safe. 
              Try refreshing the page or return to the dashboard.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '8px'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#5a67d8'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
