import { FC } from 'react';

export interface EnhancedNavbarProps {
  /** Brand name to display in the navbar */
  brandName?: string;
}

/**
 * EnhancedNavbar Component
 * 
 * A modern navigation bar with glassmorphism effect, animated tab underline,
 * and smooth dropdown animations using Framer Motion.
 * 
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Animated underline for active tab (spring physics)
 * - Neon glow effect on icon hover
 * - Smooth dropdown menu with Framer Motion
 * - Fully responsive design
 * - ARIA compliant for accessibility
 * 
 * @example
 * ```tsx
 * <EnhancedNavbar brandName="My App" />
 * ```
 */
declare const EnhancedNavbar: FC<EnhancedNavbarProps>;

export default EnhancedNavbar;
