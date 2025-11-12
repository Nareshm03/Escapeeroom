import React, { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey } from '../utils/a11yHelpers';
import '../styles/Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      const cleanup = trapFocus(modalRef.current);
      const escapeCleanup = handleEscapeKey(onClose);
      
      modalRef.current?.querySelector('button, [href], input, select, textarea')?.focus();
      document.body.style.overflow = 'hidden';

      return () => {
        cleanup();
        escapeCleanup();
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-content modal-${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
