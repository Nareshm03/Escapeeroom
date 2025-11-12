import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import './ModernLogin.css';

const ModernLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Role-based redirect
      const role = result.user?.role || result.role;
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'team') {
        navigate('/game');
      } else {
        navigate('/');
      }
    } catch (error) {
      showToast('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-login">
      <div className="particles-bg" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.5}s` }} />
        ))}
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="login-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to continue your escape room adventure</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <motion.span
                  id="email-error"
                  className="error-message"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {errors.email}
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <motion.span
                  id="password-error"
                  className="error-message"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {errors.password}
                </motion.span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </motion.div>
      </motion.div>

      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          role="alert"
          aria-live="assertive"
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default ModernLogin;
