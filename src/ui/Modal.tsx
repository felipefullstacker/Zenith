import React, { ReactNode } from 'react';
import { Modal as RNModal, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './tokens';
import { getRadius, getSpacing, createShadow } from './utils';
import { Text } from './Text';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ visible, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const insets = useSafeAreaInsets();
  const sizes = {
    sm: { maxWidth: 320 },
    md: { maxWidth: 400 },
    lg: { maxWidth: 480 },
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={[styles.container, sizes[size], { marginTop: insets.top, marginBottom: insets.bottom }]}>
                {title && (
                  <View style={styles.header}>
                    <Text variant="h3" weight="semibold" accessibilityRole="header" style={{ flex: 1, minWidth: 0 }}>
                      {title}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={8} accessibilityRole="button" accessibilityLabel="Fechar">
                      <Text variant="body" color="muted">
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                  {children}
                </ScrollView>
                
                {footer && (
                  <View style={styles.footer}>
                    {footer}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.background + 'E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(4),
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: getRadius('xl'),
    ...createShadow('lg'),
    overflow: 'hidden',
    width: '100%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getSpacing(4),
    paddingHorizontal: getSpacing(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: getSpacing(2),
    borderRadius: getRadius('md'),
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    paddingVertical: getSpacing(4),
    paddingHorizontal: getSpacing(5),
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: getSpacing(3),
    paddingVertical: getSpacing(4),
    paddingHorizontal: getSpacing(5),
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
});
