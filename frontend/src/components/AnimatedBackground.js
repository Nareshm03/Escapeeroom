import React from 'react';

/**
 * AnimatedBackground Component
 * 
 * Renders a subtle animated gradient background that moves across the screen.
 * 
 * Features:
 * - Linear gradient at 3-degree angle
 * - Color sequence: #0b1020 → #141933 → #0b1020
 * - 40s animation duration with ease-in-out timing
 * - 0.3 opacity for subtle depth effect
 * - Performance optimized with will-change
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```jsx
 * <AnimatedBackground />
 * ```
 */
const AnimatedBackground = () => {
  return <div className="animated-background" aria-hidden="true" />;
};

export default AnimatedBackground;
