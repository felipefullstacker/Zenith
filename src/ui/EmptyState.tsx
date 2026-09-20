import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors } from './tokens';
import { getSpacing, withOpacity } from './utils';
import { Icons } from './icons';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden>
        {icon ? <Text variant="h2">{icon}</Text> : <Icons.Target size={28} color={colors.primarySoft} />}
      </View>
      <Text variant="h3" weight="semibold" style={{ textAlign: 'center', marginBottom: getSpacing(2) }}>
        {title}
      </Text>
      <Text variant="body" color="muted" style={{ textAlign: 'center', maxWidth: 320 }}>
        {description}
      </Text>
      {action && (
        <View style={{ marginTop: getSpacing(6) }}>
          <Button onPress={action.onPress} variant="primary" fullWidth>
            {action.label}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: getSpacing(6),
  },
  iconContainer: {
    marginBottom: getSpacing(4),
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderWidth: 1,
    borderColor: withOpacity(colors.primarySoft, 0.24),
  },
});
