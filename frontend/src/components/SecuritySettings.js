import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import './SecuritySettings.css';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    antiCheat: false,
    safeExamBrowser: false,
    autoDisqualify: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/security-settings');
      setSettings(response.data);
    } catch (err) {
      setError('Failed to load security settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    const previousValue = settings[key];

    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    setSaving((prev) => ({ ...prev, [key]: true }));
    setError('');

    try {
      await api.put('/api/security-settings', {
        [key]: newValue,
      });

      // Log the change
      await api.post('/api/security-settings/log', {
        setting: key,
        oldValue: previousValue,
        newValue: newValue,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      // Revert on error
      setSettings((prev) => ({ ...prev, [key]: previousValue }));
      setError(`Failed to update ${key} setting`);
      console.error('Error updating setting:', err);
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const securityOptions = [
    {
      key: 'antiCheat',
      title: 'Enable Anti-Cheat',
      description: 'Monitor tab visibility and detect real-time cheating attempts',
      icon: '🛡️',
    },
    {
      key: 'safeExamBrowser',
      title: 'Enable Safe Exam Browser Mode',
      description: 'Lock down browser and restrict system access during exams',
      icon: '🔒',
    },
    {
      key: 'autoDisqualify',
      title: 'Auto-Disqualify on Violation',
      description: 'Automatically disqualify users when violations are detected',
      icon: '⚠️',
    },
  ];

  if (loading) {
    return (
      <div className="security-settings">
        <div className="loading-state">Loading security settings...</div>
      </div>
    );
  }

  return (
    <div className="security-settings">
      <div className="settings-header">
        <h2>Security Settings</h2>
        <p>Configure security and anti-cheat measures for your quizzes</p>
      </div>

      {error && (
        <motion.div
          className="error-banner"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <div className="settings-list">
        {securityOptions.map((option) => (
          <motion.div
            key={option.key}
            className="setting-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="setting-info">
              <div className="setting-icon">{option.icon}</div>
              <div className="setting-content">
                <h3 className="setting-title">{option.title}</h3>
                <p className="setting-description">{option.description}</p>
              </div>
            </div>

            <div className="setting-controls">
              <motion.div
                className={`status-pill ${settings[option.key] ? 'on' : 'off'}`}
                animate={{
                  backgroundColor: settings[option.key]
                    ? 'rgba(72, 187, 120, 0.1)'
                    : 'rgba(156, 163, 175, 0.1)',
                }}
                transition={{ duration: 0.2 }}
              >
                {settings[option.key] ? 'ON' : 'OFF'}
              </motion.div>

              <button
                className={`toggle-switch ${settings[option.key] ? 'active' : ''}`}
                onClick={() => handleToggle(option.key)}
                disabled={saving[option.key]}
                aria-label={`Toggle ${option.title}`}
                aria-pressed={settings[option.key]}
                role="switch"
              >
                <motion.div
                  className="toggle-slider"
                  animate={{
                    x: settings[option.key] ? 24 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>

              {saving[option.key] && (
                <motion.div
                  className="saving-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Saving...
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="settings-footer">
        <p className="footer-note">
          ℹ️ All changes are saved automatically and take effect immediately
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;
