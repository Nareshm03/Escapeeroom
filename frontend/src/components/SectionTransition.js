import React from 'react';
import { motion } from 'framer-motion';

const SectionTransition = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  stagger = 0.1,
  className = ''
}) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: stagger
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const SectionItem = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};

export default SectionTransition;
