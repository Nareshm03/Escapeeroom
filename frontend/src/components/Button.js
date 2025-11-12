import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClass = `
    ds-btn 
    ds-btn-${variant} 
    ds-btn-${size}
    ${loading ? 'ds-btn-loading' : ''}
    ${className}
  `.trim();

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {loading && <span className="ds-btn-spinner"></span>}
      {icon && !loading && <span className="ds-btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
