import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { colors } from './tokens';
import { getRadius } from './utils';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ label, variant = 'primary', size = 'md' }: BadgeProps) {
  const variants = {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.background,
    },
    secondary: {
      backgroundColor: colors.surfaceVariant,
      textColor: colors.accent,
    },
    success: {
      backgroundColor: colors.success,
      textColor: colors.background,
    },
    warning: {
      backgroundColor: colors.warning,
      textColor: colors.background,
    },
    danger: {
      backgroundColor: colors.danger,
      textColor: colors.background,
    },
  };

  const sizes = {
    sm: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 12,
    },
    md: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      fontSize: 14,
    },
    lg: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      fontSize: 16,
    },
  };

  return (
    <View
      style={{
        backgroundColor: variants[variant].backgroundColor,
        borderRadius: getRadius('full'),
        paddingHorizontal: sizes[size].paddingHorizontal,
        paddingVertical: sizes[size].paddingVertical,
      }}
    >
      <Text
        variant="caption"
        weight="semibold"
        color={variants[variant].textColor as any}
      >
        {label}
      </Text>
    </View>
  );
}
