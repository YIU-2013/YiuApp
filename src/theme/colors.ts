// ─── Ham Renk Paleti ─────────────────────────────────────────────────────────
const palette = {
  // Navy / Kurumsal Mavi
  navy950: '#071B42',
  navy900: '#0B2E6B',
  navy700: '#1A3C8A',
  navy500: '#2D5BAB',
  navy100: '#D6E2F5',
  navy50: '#EEF4FF',

  // Kırmızı Vurgu
  red700: '#B91C1C',
  red600: '#D62828',
  red400: '#F87171',
  red100: '#FEE2E2',
  red50: '#FFF5F5',

  // Nötr
  white: '#FFFFFF',
  black: '#000000',
  gray950: '#030712',
  gray900: '#111827',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F7F8FA',

  // Semantik
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  info: '#2563EB',
  infoBg: '#DBEAFE',
} as const;

// ─── Light Theme ─────────────────────────────────────────────────────────────
export const lightColors = {
  // Marka renkleri
  primary: palette.navy900,
  primaryHover: palette.navy700,
  primaryFaded: palette.navy50,
  accent: palette.red600,
  accentHover: palette.red700,
  accentFaded: palette.red50,

  // Layout
  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.gray200,
  borderSubtle: palette.gray100,
  divider: palette.gray200,

  // Metin
  textPrimary: palette.gray900,
  textSecondary: palette.gray700, // Darker gray for higher accessibility contrast
  textMuted: palette.gray500,     // Darker gray for better visibility
  textInverse: palette.white,
  textBrand: palette.navy900,
  textDanger: palette.red600,

  // UI elementleri
  iconBg: palette.navy50,
  tabBarBg: palette.white,
  headerBg: palette.white,
  statusBarBg: palette.white,

  // Badge
  badgeBlueBg: palette.navy50,
  badgeBlueText: palette.navy900,
  badgeRedBg: palette.red100,
  badgeRedText: palette.red600,
  badgeGreenBg: palette.successBg,
  badgeGreenText: '#166534',
  badgeYellowBg: palette.warningBg,
  badgeYellowText: '#92400E',

  // Semantik
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
} as const;

// ─── Dark Theme ──────────────────────────────────────────────────────────────
// İleride dinamik tema desteği için hazır
export const darkColors = {
  primary: '#4A8FE8',
  primaryHover: '#6BA8F0',
  primaryFaded: '#1C2A4A',
  accent: palette.red400,
  accentHover: palette.red600,
  accentFaded: '#3D1515',

  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#21262D',
  border: '#30363D',
  borderSubtle: '#21262D',
  divider: '#30363D',

  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  textInverse: palette.gray900,
  textBrand: '#79B8FF',
  textDanger: palette.red400,

  iconBg: '#1C2128',
  tabBarBg: '#161B22',
  headerBg: '#161B22',
  statusBarBg: '#0D1117',

  badgeBlueBg: '#1C2A4A',
  badgeBlueText: '#79B8FF',
  badgeRedBg: '#3D1515',
  badgeRedText: palette.red400,
  badgeGreenBg: '#0D2818',
  badgeGreenText: '#4ADE80',
  badgeYellowBg: '#2D1F00',
  badgeYellowText: '#FCD34D',

  success: '#4ADE80',
  warning: '#FCD34D',
  error: palette.red400,
  info: '#60A5FA',
} as const;

export type Colors = typeof lightColors;

// Aktif tema — ileri aşamada Context/hook ile dinamik hale getirilebilir
export const colors: Colors = lightColors;
