import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import './EnhancedSettings.css';

const DEFAULT_SETTINGS = {
  quizName: 'Escape Room Challenge',
  showQuizName: true,
  duration: 60,
  timeLimit: 3600,
  autoStart: false,
  antiCheat: false,
  safeExamBrowser: false,
  autoDisqualify: false,
};

const EnhancedSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Apply security settings when they change
  useEffect(() => {
    applySecuritySettings();
  }, [settings.antiCheat, settings.safeExamBrowser]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/settings');
      const fetchedSettings = response.data;
      setSettings(fetchedSettings);
      localStorage.setItem('cachedSettings', JSON.stringify(fetchedSettings));
    } catch (error) {
      // Fallback to localStorage
      const cached = localStorage.getItem('cachedSettings');
      if (cached) {
        setSettings(JSON.parse(cached));
        showToast('Using cached settings (offline mode)', 'warning');
      } else {
        showToast('Failed to load settings', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const applySecuritySettings = () => {
    if (settings.antiCheat) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    if (settings.safeExamBrowser) {
      document.addEventListener('contextmenu', preventContextMenu);
    } else {
      document.removeEventListener('contextmenu', preventContextMenu);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.warn('Tab visibility changed - potential cheating detected');
    }
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
  };

  const saveSettings = async (updatedSettings) => {
    setSaving(true);
    try {
      await api.put('/api/settings', updatedSettings);
      localStorage.setItem('cachedSettings', JSON.stringify(updatedSettings));
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      // Save to localStorage as fallback
      localStorage.setItem('cachedSettings', JSON.stringify(updatedSettings));
      showToast('Settings saved locally (will sync when online)', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleInputChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
  };

  const handleInputBlur = () => {
    saveSettings(settings);
  };

  const handleReset = async () => {
    setShowResetDialog(false);
    setSaving(true);
    try {
      await api.put('/api/settings', DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('cachedSettings', JSON.stringify(DEFAULT_SETTINGS));
      showToast('Settings reset to defaults', 'success');
    } catch (error) {
      showToast('Failed to reset settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'event', label: 'Event Settings', icon: '📅' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="enhanced-settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <button
          className="btn-reset"
          onClick={() => setShowResetDialog(true)}
          disabled={saving}
        >
          Reset to Defaults
        </button>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="settings-section"
            >
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Quiz Name</h3>
                  <p>Display name for your escape room challenge</p>
                </div>
                <input
                  type="text"
                  value={settings.quizName}
                  onChange={(e) => handleInputChange('quizName', e.target.value)}
                  onBlur={handleInputBlur}
                  className="setting-input"
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Show Quiz Name</h3>
                  <p>Display quiz name in navigation</p>
                </div>
                <button
                  className={`toggle-switch ${settings.showQuizName ? 'active' : ''}`}
                  onClick={() => handleToggle('showQuizName')}
                  disabled={saving}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: settings.showQuizName ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'event' && (
            <motion.div
              key="event"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="settings-section"
            >
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Duration (minutes)</h3>
                  <p>Default quiz duration</p>
                </div>
                <input
                  type="number"
                  value={settings.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  onBlur={handleInputBlur}
                  className="setting-input"
                  min="1"
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Time Limit (seconds)</h3>
                  <p>Maximum time allowed per question</p>
                </div>
                <input
                  type="number"
                  value={settings.timeLimit}
                  onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  onBlur={handleInputBlur}
                  className="setting-input"
                  min="1"
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Auto Start</h3>
                  <p>Automatically start quiz when user joins</p>
                </div>
                <button
                  className={`toggle-switch ${settings.autoStart ? 'active' : ''}`}
                  onClick={() => handleToggle('autoStart')}
                  disabled={saving}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: settings.autoStart ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="settings-section"
            >
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Enable Anti-Cheat</h3>
                  <p>Monitor tab visibility and detect cheating attempts</p>
                </div>
                <button
                  className={`toggle-switch ${settings.antiCheat ? 'active' : ''}`}
                  onClick={() => handleToggle('antiCheat')}
                  disabled={saving}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: settings.antiCheat ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Safe Exam Browser Mode</h3>
                  <p>Lock down browser and restrict system access</p>
                </div>
                <button
                  className={`toggle-switch ${settings.safeExamBrowser ? 'active' : ''}`}
                  onClick={() => handleToggle('safeExamBrowser')}
                  disabled={saving}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: settings.safeExamBrowser ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Auto-Disqualify on Violation</h3>
                  <p>Automatically disqualify users when violations detected</p>
                </div>
                <button
                  className={`toggle-switch ${settings.autoDisqualify ? 'active' : ''}`}
                  onClick={() => handleToggle('autoDisqualify')}
                  disabled={saving}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: settings.autoDisqualify ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`settings-toast ${toast.type}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            role="alert"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetDialog && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetDialog(false)}
            />
            <motion.div
              className="confirm-dialog"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3>Reset Settings?</h3>
              <p>This will reset all settings to their default values. This action cannot be undone.</p>
              <div className="dialog-actions">
                <button className="btn btn-secondary" onClick={() => setShowResetDialog(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSettings;
