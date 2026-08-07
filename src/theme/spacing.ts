import { rs } from '../utils/responsive';

/**
 * Design token spacing sistemi.
 * Tüm padding/margin/gap değerleri buradan gelecek — sabit sayı yasak.
 */
export const spacing = {
  xxs: rs(2),
  xs: rs(4),
  sm: rs(8),
  md: rs(12),
  base: rs(16),
  lg: rs(20),
  xl: rs(24),
  xxl: rs(32),
  xxxl: rs(40),
  huge: rs(56),
} as const;

export type SpacingKey = keyof typeof spacing;
