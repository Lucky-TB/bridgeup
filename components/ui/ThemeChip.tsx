import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface ThemeChipProps {
  label: string;
  emoji: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ThemeChip({
  label,
  emoji,
  selected = false,
  onPress,
  style,
}: ThemeChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  emoji: {
    fontSize: theme.fontSize.base,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});