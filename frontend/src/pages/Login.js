import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '40px' }}>
        <h1 style={{ marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h1>
        <p className="caption" style={{ textAlign: 'center', opacity: 0.7, marginBottom: '32px' }}>
          Sign in to continue your escape room adventure
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '16px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '14px', opacity: 0.7 }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
