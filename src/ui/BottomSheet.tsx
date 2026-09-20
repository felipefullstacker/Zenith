import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal as RNModal, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors } from './tokens';
import { getRadius, getSpacing, createShadow } from './utils';
import { useState } from 'react';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BottomSheet({ visible, onClose, children, title, height = 'md' }: BottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  
  const heights = {
    sm: screenHeight * 0.35,
    md: screenHeight * 0.5,
    lg: screenHeight * 0.7,
    xl: screenHeight * 0.9,
  };

  // Close on overlay tap
  const handleOverlayPress = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <RNModal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay} onStartShouldSetResponder={() => true}>
      <TouchableOpacity style={styles.backdrop} onPress={handleOverlayPress} activeOpacity={1}>
        <View 
          style={[
            styles.content,
             { height: heights[height], paddingBottom: Math.max(insets.bottom, getSpacing(3)) },
            isDragging ? createShadow('sm') : createShadow('lg'),
          ]}
        >
          {title && (
            <View style={styles.header}>
              <Text variant="h3" weight="semibold">
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text variant="caption" color="muted">
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          
           <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
             {children}
           </ScrollView>
         </View>
      </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.background + 'CC',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: getRadius('2xl'),
    borderTopRightRadius: getRadius('2xl'),
    overflow: 'hidden',
    ...createShadow('lg'),
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
    padding: getSpacing(1),
  },
  scrollContent: {
    flexGrow: 1,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: getSpacing(3),
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: getRadius('full'),
  },
});
