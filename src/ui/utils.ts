// Zenith Design System - Utility Functions for Style Computation

import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, radii, spacing, fontSize, fontWeight, lineHeight, zIndex, shadows } from './tokens';

/**
 * Utility function to conditionally apply styles based on conditions
 * Similar to clsx but for React Native styles
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get theme colors with opacity support
 */
export function withOpacity(color: string, opacity: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  return color;
}

/**
 * Create a shadow style object
 */
export function createShadow(level: 'sm' | 'md' | 'lg'): ViewStyle {
  const shadow = shadows[level];
  return Platform.OS === 'web'
    ? { boxShadow: `${shadow.shadowOffset.width}px ${shadow.shadowOffset.height}px ${shadow.shadowRadius}px ${withOpacity(shadow.shadowColor, shadow.shadowOpacity)}` } as ViewStyle
    : shadow;
}

/**
 * Create a responsive style object
 */
export function responsiveStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  baseStyle: T,
  platformStyles?: {
    ios?: Partial<T>;
    android?: Partial<T>;
    web?: Partial<T>;
  }
): T {
  const platform = Platform.OS as 'ios' | 'android' | 'web';
  return {
    ...baseStyle,
    ...(platformStyles?.[platform] ?? {}),
  };
}

/**
 * Get spacing value by scale
 */
export function getSpacing(scale: keyof typeof spacing): number {
  return spacing[scale];
}

/**
 * Get font size by scale
 */
export function getFontSize(scale: keyof typeof fontSize): number {
  return fontSize[scale];
}

/**
 * Get border radius by scale
 */
export function getRadius(scale: keyof typeof radii): number {
  return radii[scale];
}

/**
 * Create a solid border style
 */
export function createBorder(
  width: number = 1,
  color: string = colors.border,
  radius: number = radii.md
): ViewStyle {
  return {
    borderWidth: width,
    borderColor: color,
    borderRadius: radius,
  };
}

/**
 * Create a text style with font and color
 */
export function createTextStyle(
  size: keyof typeof fontSize = 'base',
  weight: keyof typeof fontWeight = 'normal',
  align: 'auto' | 'left' | 'right' | 'center' | 'justify' = 'left',
  color: string = colors.text
): TextStyle {
  return {
    fontSize: fontSize[size],
    fontWeight: fontWeight[weight],
    textAlign: align,
    color: color,
    lineHeight: fontSize[size] * lineHeight.tight,
  };
}

/**
 * Animation timing configuration
 */
export const timing = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
};
