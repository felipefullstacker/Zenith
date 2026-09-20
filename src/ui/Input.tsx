import React, { useState } from 'react';
import { View, TextInput, TextInputProps, ViewStyle, TextStyle, StyleProp, Pressable, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Text } from './Text';
import { colors, radii } from './tokens';
import { getSpacing, withOpacity } from './utils';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  rightIconAccessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  variant?: 'default' | 'outline' | 'filled';
}

export function Input({
  label, error, hint, leftIcon, rightIcon, onRightIconPress,
  rightIconAccessibilityLabel = 'Ação do campo', containerStyle, inputStyle,
  variant = 'default', secureTextEntry, onFocus, onBlur, editable = true,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = error ? colors.danger : isFocused ? colors.borderFocus : colors.border;
  const iconButtonStyle: ViewStyle = {
    minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md,
  };

  return (
    <View style={[{ minWidth: 0, gap: getSpacing(2) }, containerStyle]}>
      {label && <Text variant="caption" weight="semibold">{label}</Text>}
      <View style={[
        {
          minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: getSpacing(2),
          paddingHorizontal: getSpacing(3), paddingVertical: getSpacing(1),
          borderRadius: radii.lg, borderWidth: 1, borderColor,
          backgroundColor: variant === 'outline' ? 'transparent' : variant === 'filled' ? colors.surfaceVariant : colors.surface,
          opacity: editable ? 1 : 0.6,
        },
        isFocused && Platform.OS === 'web' && { boxShadow: `0 0 0 3px ${withOpacity(borderColor, 0.18)}` },
      ]}>
        {leftIcon}
        <TextInput
          {...props}
          editable={editable}
          accessibilityLabel={props.accessibilityLabel ?? label}
          aria-invalid={!!error}
          style={[
            { flex: 1, minWidth: 0, color: colors.text, fontSize: 16, paddingVertical: getSpacing(2) },
            Platform.OS === 'web' && { outlineWidth: 0 },
            inputStyle,
          ]}
          placeholderTextColor={props.placeholderTextColor ?? colors.textMuted}
          selectionColor={colors.primarySoft}
          onFocus={(event) => { setIsFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setIsFocused(false); onBlur?.(event); }}
          secureTextEntry={!!secureTextEntry && !showPassword}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setShowPassword((value) => !value)} disabled={!editable}
            style={({ pressed }) => [iconButtonStyle, pressed && { backgroundColor: colors.surfaceVariant }]}
            accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityState={{ disabled: !editable }}
          >
            {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
          </Pressable>
        ) : rightIcon && onRightIconPress ? (
          <Pressable onPress={onRightIconPress} disabled={!editable} style={iconButtonStyle}
            accessibilityRole="button" accessibilityLabel={rightIconAccessibilityLabel} accessibilityState={{ disabled: !editable }}>
            {rightIcon}
          </Pressable>
        ) : rightIcon}
      </View>
      {error ? <Text variant="caption" color="danger" accessibilityLiveRegion="polite">{error}</Text>
        : hint ? <Text variant="caption" color="muted">{hint}</Text> : null}
    </View>
  );
}
