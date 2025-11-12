import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1000, decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration });

  useEffect(() => {
    spring.set(value);
    const unsubscribe = spring.onChange(latest => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [value, spring]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue);

  return <span>{formatted}</span>;
};

export default AnimatedCounter;
