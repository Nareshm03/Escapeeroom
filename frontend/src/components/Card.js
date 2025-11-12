import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ 
  children, 
  elevated = false, 
  hoverable = true,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClass = `
    ds-card 
    ${elevated ? 'ds-card-elevated' : ''} 
    ${hoverable ? 'ds-card-hoverable' : ''}
    ${className}
  `.trim();

  return (
    <motion.div
      className={cardClass}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hoverable ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`ds-card-header ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`ds-card-body ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`ds-card-footer ${className}`}>
    {children}
  </div>
);

export default Card;
