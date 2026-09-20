import React, { useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, Platform, StyleProp, ViewStyle } from 'react-native';
import { colors } from './tokens';
import { createTextStyle, getRadius, getSpacing, createBorder, createShadow } from './utils';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  children,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  accessibilityState,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const baseStyles: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: getSpacing(2),
    opacity: isDisabled ? 0.6 : 1,
  };

  const sizeStyles = {
    sm: {
      paddingVertical: getSpacing(1),
      paddingHorizontal: getSpacing(3),
      minHeight: 44,
      borderRadius: getRadius('lg'),
    },
    md: {
      paddingVertical: getSpacing(2),
      paddingHorizontal: getSpacing(4),
      minHeight: 48,
      borderRadius: getRadius('xl'),
    },
    lg: {
      paddingVertical: getSpacing(3),
      paddingHorizontal: getSpacing(6),
      minHeight: 56,
      borderRadius: getRadius('xl'),
    },
  };

  const variants = {
    primary: {
      container: {
        backgroundColor: colors.primary,
        ...createBorder(1, colors.primarySoft),
        ...createShadow('md'),
      },
      text: {
        color: colors.primaryInverse,
        ...createTextStyle('base', 'semibold'),
      },
    },
    secondary: {
      container: {
        backgroundColor: colors.surfaceVariant,
        ...createBorder(1, colors.border),
        borderRadius: getRadius('xl'),
      },
      text: {
        color: colors.text,
        ...createTextStyle('base', 'semibold'),
      },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        ...createBorder(0),
      },
      text: {
        color: colors.text,
        ...createTextStyle('base', 'medium'),
      },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        ...createBorder(1, colors.borderFocus),
        borderRadius: getRadius('xl'),
      },
      text: {
        color: colors.primarySoft,
        ...createTextStyle('base', 'semibold'),
      },
    },
  };

  return (
    <TouchableOpacity
      style={[
        baseStyles,
        variants[variant].container,
        sizeStyles[size],
        fullWidth && { width: '100%' },
        style as ViewStyle,
        focused && (Platform.OS === 'web'
          ? { outlineWidth: 2, outlineColor: colors.borderFocus, outlineOffset: 3 }
          : { borderWidth: 2, borderColor: colors.borderFocus }),
        pressed && !isDisabled && { opacity: 0.85 },
      ]}
      {...props}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ ...accessibilityState, disabled: !!isDisabled, busy: isLoading }}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); setPressed(false); onBlur?.(event); }}
      onPressIn={(event) => { setPressed(true); onPressIn?.(event); }}
      onPressOut={(event) => { setPressed(false); onPressOut?.(event); }}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variants[variant].text.color as string}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          {typeof children === 'string' ? (
              <Text style={[variants[variant].text, { flexShrink: 1, textAlign: 'center' }]} numberOfLines={2} ellipsizeMode="tail">{children}</Text>
          ) : (
            children
          )}
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

export { Text } from './Text';
