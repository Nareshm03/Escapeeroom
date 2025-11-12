import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h3 id="modal-title" className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              <button
                className="btn-modal btn-cancel"
                onClick={onCancel}
                aria-label="Cancel action"
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-confirm"
                onClick={onConfirm}
                aria-label="Confirm action"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
