import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from './tokens';

export function Spinner({ size = 'large', color }: { size?: 'small' | 'large'; color?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || colors.primarySoft} accessibilityLabel="Carregando" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
