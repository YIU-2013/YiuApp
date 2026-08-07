import { rs } from '../utils/responsive';

/**
 * Typography token sistemi.
 * Tüm font-size değerleri rs() ile ölçeklendirilmiş.
 */
export const typography = {
  sizes: {
    xxs: rs(9),
    xs: rs(10),
    sm: rs(12),
    base: rs(14),
    md: rs(15),
    lg: rs(17),
    xl: rs(20),
    xxl: rs(24),
    xxxl: rs(28),
    display: rs(32),
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  letterSpacing: {
    tightest: -0.5,
    tight: -0.3,
    normal: 0,
    wide: 0.3,
    wider: 0.8,
    widest: 1.5,
    caps: 1.2,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.4, // Widened from 1.375 for better readability
    normal: 1.5,
    relaxed: 1.65, // Widened from 1.625 for premium layout breathing room
    loose: 2,
  },
} as const;

export type Typography = typeof typography;
