import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '40px' }}>
        <h1 style={{ marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
        <p className="caption" style={{ textAlign: 'center', opacity: 0.7, marginBottom: '32px' }}>
          Join the escape room challenge
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '14px', opacity: 0.7 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
