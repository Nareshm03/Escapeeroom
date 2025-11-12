import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration) => {
    const id = Date.now() + Math.random();
    const newToast = { 
      id, 
      type, 
      message, 
      duration: duration !== undefined ? duration : (type === 'success' ? 5000 : 0)
    };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addToast('success', message, duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast('error', message, duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast('warning', message, duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
