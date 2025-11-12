import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/navigation.css';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="glass-nav">
      <div className="glass-nav-content">
        <div className="glass-nav-logo">Escape Room</div>
        <div className="glass-nav-links">
          <Link to="/" className={`glass-nav-link ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/teams" className={`glass-nav-link ${isActive('/teams') ? 'active' : ''}`}>
            Teams
          </Link>
          <Link to="/game" className={`glass-nav-link ${isActive('/game') ? 'active' : ''}`}>
            Game
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" className={`glass-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              Admin
            </Link>
          )}
          <Link to="/results" className={`glass-nav-link ${isActive('/results') ? 'active' : ''}`}>
            Results
          </Link>
          <Link to="/settings" className={`glass-nav-link ${isActive('/settings') ? 'active' : ''}`}>
            Settings
          </Link>
          <button onClick={logout} className="btn-glass" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;
