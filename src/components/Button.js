import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../theme';

export default function Button({ title, onPress, variant = 'primary', icon }) {
  const backgroundColor = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    outline: 'transparent',
  }[variant];

  const textColor = variant === 'outline' ? colors.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        variant === 'outline' && styles.outline,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon && <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: spacing.xs }} />}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    fontSize: fontSize.subheading,
    fontWeight: '600',
  },
});