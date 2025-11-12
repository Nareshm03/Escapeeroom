import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import PropTypes from 'prop-types';
import './EnhancedNavbar.css';

const EnhancedNavbar = ({ brandName = 'Escape Room' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⊞' },
    { path: '/teams', label: 'Teams', icon: '👥' },
    { path: '/game', label: 'Game', icon: '🎮' },
    { path: '/live', label: 'Live', icon: '📡' },
  ];

  const isActive = (path) => location.pathname === path;
  const activeIndex = navItems.findIndex(item => isActive(item.path));

  return (
    <nav className="enhanced-navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" aria-label="Home">
          {brandName}
        </Link>

        {user && (
          <>
            <div className="navbar-tabs" role="tablist">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-tab ${isActive(item.path) ? 'active' : ''}`}
                  role="tab"
                  aria-selected={isActive(item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <span className="nav-tab-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="nav-tab-label">{item.label}</span>
                </Link>
              ))}
              {activeIndex !== -1 && (
                <motion.div
                  className="nav-underline"
                  layoutId="underline"
                  initial={false}
                  animate={{
                    x: `calc(${activeIndex * 100}% + ${activeIndex * 16}px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                    duration: 0.3,
                  }}
                />
              )}
            </div>

            <div className="navbar-actions">
              <div className="user-menu">
                <button
                  className="user-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="dropdown-menu"
                      role="menu"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <div className="dropdown-header">{user.name}</div>
                      <Link
                        to="/settings"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        <span aria-hidden="true">⚙️</span>
                        Settings
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item danger"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <span aria-hidden="true">🚪</span>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {!user && (
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

EnhancedNavbar.propTypes = {
  brandName: PropTypes.string,
};

export default EnhancedNavbar;
