// Design System Tokens
// Centralized configuration for consistent styling across Zenith

const premiumDark = {
  background: '#0B1020',
  surface: '#101827',
  surfaceVariant: '#172132',
  elevated: '#1C2940',

  primary: '#8B5CF6',
  primarySoft: '#A78BFA',
  primaryMuted: '#C4B5FD',
  primaryInverse: '#F8FAFC',

  // Accents
  accent: '#F59E0B',
  accentSoft: '#FCD34D',
  accentMuted: '#FDE68A',

  // Status
  success: '#34D399',
  successMuted: '#A7F3D0',
  warning: '#FBBF24',
  warningMuted: '#FDE68A',
  danger: '#F87171',
  dangerMuted: '#FCA5A5',
  info: '#60A5FA',
  infoMuted: '#BFDBFE',

  // Text
  text: '#F8FAFC',
  textMuted: '#A5B4CF',
  textInverse: '#0B1220',
  textLink: '#8B5CF6',

  // Border
  border: '#243247',
  borderMuted: '#1B2739',
  borderFocus: '#A78BFA',

  // Gradients
  gradientDark: 'linear-gradient(180deg, #070B14 0%, #101827 100%)',
  gradientSurface: 'linear-gradient(180deg, #111827 0%, #1D2942 100%)',
  gradientPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)',
  gradientAccent: 'linear-gradient(135deg, #F59E0B 0%, #FDE68A 100%)',
};

const premiumLight = {
  background: '#F5F7FF',
  surface: '#FFFFFF',
  surfaceVariant: '#EEF2FF',
  elevated: '#F8FAFF',

  primary: '#6D4AFF',
  primarySoft: '#8B5CF6',
  primaryMuted: '#C4B5FD',
  primaryInverse: '#FFFFFF',

  accent: '#F59E0B',
  accentSoft: '#FCD34D',
  accentMuted: '#FDE68A',

  success: '#10B981',
  successMuted: '#6EE7B7',
  warning: '#F59E0B',
  warningMuted: '#FCD34D',
  danger: '#EF4444',
  dangerMuted: '#FCA5A5',
  info: '#3B82F6',
  infoMuted: '#BFDBFE',

  text: '#111827',
  textMuted: '#5F6F8A',
  textInverse: '#F8FAFC',
  textLink: '#6D4AFF',

  border: '#E5E7EB',
  borderMuted: '#EEF2F7',
  borderFocus: '#8B5CF6',

  gradientDark: 'linear-gradient(180deg, #F5F7FF 0%, #ECF1FF 100%)',
  gradientSurface: 'linear-gradient(180deg, #FFFFFF 0%, #F3F6FF 100%)',
  gradientPrimary: 'linear-gradient(135deg, #6D4AFF 0%, #A78BFA 100%)',
  gradientAccent: 'linear-gradient(135deg, #F59E0B 0%, #FDE68A 100%)',
};

export const themes = {
  dark: { name: 'dark', colors: premiumDark },
  light: { name: 'light', colors: premiumLight },
};

export const colors = themes.dark.colors;

export const radii = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  '2xl': 30,
  full: 9999,
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const fontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export const shadows = {
  sm: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
};
