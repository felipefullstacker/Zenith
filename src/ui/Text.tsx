import React from 'react';
import { Text as RNText, TextProps, StyleProp, TextStyle } from 'react-native';
import { colors, fontWeight } from './tokens';
import { createTextStyle, getFontSize } from './utils';

interface TextPropsExtended extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'danger' | 'success';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  selectable?: boolean;
}

export function Text({
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}: TextPropsExtended) {
  const colorMap = {
    primary: colors.text,
    secondary: colors.textMuted,
    muted: colors.textMuted,
    danger: colors.danger,
    success: colors.success,
    link: colors.textLink,
  };

  const variants = {
    h1: createTextStyle('4xl', 'bold', align, colorMap[color]),
    h2: createTextStyle('3xl', 'bold', align, colorMap[color]),
    h3: createTextStyle('2xl', 'semibold', align, colorMap[color]),
    body: createTextStyle('base', weight as keyof typeof fontWeight, align, colorMap[color]),
    caption: createTextStyle('sm', weight as keyof typeof fontWeight, align, colorMap[color]),
    label: createTextStyle('base', 'medium', align, colorMap[color]),
  };

  return (
    <RNText
      style={[variants[variant], style as TextStyle]}
      {...props}
    >
      {children}
    </RNText>
  );
}
