import { ReactNode, MouseEvent } from 'react';

export interface InteractiveTileProps {
  /** Navigation path (if used as Link) */
  to?: string | null;
  /** Icon to display in the left chip (emoji, SVG, or React component) */
  icon: ReactNode;
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string | null;
  /** Click handler (if used as button) */
  onClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | null;
}

/**
 * InteractiveTile Component
 * 
 * An interactive UI tile with material-style ripple animation, hover glow effects,
 * and full accessibility support. Can be used as a Link or button.
 * 
 * Features:
 * - Material ripple animation from click point
 * - Hover glow effect with accent color
 * - Gradient edge effects
 * - Icon chip with elevation
 * - Keyboard navigation support
 * - WCAG 2.1 AA compliant
 * - 60fps optimized animations
 * 
 * Specifications:
 * - Fixed height: 84px (72-76px on mobile)
 * - Dynamic width: 160px-300px
 * - Border radius: 12px
 * - Focus outline: 2px cyan with 4px offset
 * 
 * @example
 * ```tsx
 * // As Link
 * <InteractiveTile
 *   icon="👥"
 *   title="Manage Teams"
 *   subtitle="Create and organize teams"
 *   to="/teams"
 * />
 * 
 * // As Button
 * <InteractiveTile
 *   icon="⚙️"
 *   title="Settings"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
declare const InteractiveTile: React.FC<InteractiveTileProps>;

export default InteractiveTile;
