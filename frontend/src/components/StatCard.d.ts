import { ReactNode } from 'react';

export interface TrendData {
  /** Direction of the trend: '+' for positive, '-' for negative */
  direction: '+' | '-';
  /** Magnitude of the trend (e.g., '12%', '5', '2.3K') */
  amount: string | number;
}

export interface StatCardProps {
  /** Icon to display (React component, emoji, or JSX element) */
  icon: ReactNode;
  /** Label/title for the statistic */
  label: string;
  /** Main statistic value to display */
  value: string | number;
  /** Optional trend indicator with direction and amount */
  trend?: TrendData | null;
  /** Optional array of numerical data points for sparkline chart */
  sparkline?: number[] | null;
}

/**
 * StatCard Component
 * 
 * A reusable card component for displaying statistics with optional trend indicators
 * and sparkline charts. Features glassmorphic styling and responsive design.
 * 
 * @example
 * ```tsx
 * <StatCard
 *   icon="👥"
 *   label="Total Users"
 *   value="1,234"
 *   trend={{ direction: '+', amount: '12%' }}
 *   sparkline={[10, 15, 13, 18, 22, 20, 25]}
 * />
 * ```
 */
declare const StatCard: React.MemoExoticComponent<
  React.FC<StatCardProps>
>;

export default StatCard;
