import { Platform } from 'react-native';

/**
 * Cross-platform shadow sistemi.
 *
 * iOS: shadowColor/Offset/Opacity/Radius
 * Android: elevation
 *
 * Spread ile style'a ekle:
 *   style={[styles.card, shadows.md]}
 */
export const shadows = {
  none: {},

  xs: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: {},
  }),

  sm: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {},
  }),

  md: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),

  lg: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.10,
      shadowRadius: 18,
    },
    android: { elevation: 6 },
    default: {},
  }),

  xl: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),

  video: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.16,
      shadowRadius: 28,
    },
    android: { elevation: 10 },
    default: {},
  }),

  /** Tab bar üst kenara gölge (ters yön) */
  tabBar: Platform.select({
    ios: {
      shadowColor: '#071B42',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 8 },
    default: {},
  }),

  /** Logo / avatar gölgesi — marka rengiyle */
  brand: Platform.select({
    ios: {
      shadowColor: '#0B2E6B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
    },
    android: { elevation: 5 },
    default: {},
  }),
} as const;

export type ShadowKey = keyof typeof shadows;
