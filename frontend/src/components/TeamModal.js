import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trapFocus, handleEscapeKey } from '../utils/a11yHelpers';
import '../styles/TeamModal.css';

const TeamModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        accessCode: generateAccessCode()
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      const escapeCleanup = handleEscapeKey(onClose);
      firstInputRef.current?.focus();
      document.body.style.overflow = 'hidden';

      return () => {
        cleanup();
        escapeCleanup();
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Team name must not exceed 30 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="team-modal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-header">
            <h2 id="modal-title">{initialData ? 'Edit Team' : 'Create New Team'}</h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="team-name">
                Team Name <span className="required">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="team-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={handleKeyDown}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                maxLength={30}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="team-description">Description</label>
              <textarea
                id="team-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="access-code">Access Code</label>
              <div className="access-code-group">
                <input
                  id="access-code"
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                  className="access-code-input"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accessCode: generateAccessCode() })}
                  className="btn-secondary"
                  aria-label="Generate new access code"
                >
                  🔄
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {initialData ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamModal;
