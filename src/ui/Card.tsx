import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { colors } from './tokens';
import { getRadius, getSpacing, createBorder, createShadow } from './utils';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  borderRadius = 'lg',
  style,
  children,
  ...props
}: CardProps) {
  const paddingSizes = {
    sm: getSpacing(3),
    md: getSpacing(4),
    lg: getSpacing(6),
  };

  const radiusValues = {
    sm: getRadius('sm'),
    md: getRadius('md'),
    lg: getRadius('lg'),
    xl: getRadius('xl'),
  };

  const variants = {
    default: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      ...createShadow('sm'),
    },
    elevated: {
      backgroundColor: colors.elevated,
      borderColor: colors.border,
      borderWidth: 1,
      ...createShadow('md'),
    },
    outline: {
      backgroundColor: 'rgba(255,255,255,0.02)',
      ...createBorder(1, colors.border),
    },
    filled: {
      backgroundColor: colors.surfaceVariant,
      ...createBorder(0),
    },
  };

  return (
    <View
      style={[
        {
          padding: paddingSizes[padding],
          ...variants[variant],
          minWidth: 0,
          borderRadius: radiusValues[borderRadius],
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
