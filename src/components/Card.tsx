import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, shadows } from '../theme';
import { rs } from '../utils/responsive';
import type { ShadowKey } from '../theme';

interface CardProps {
  /** Kart içeriği */
  children: React.ReactNode;
  /** Gölge seviyesi — varsayılan: 'md' */
  shadow?: ShadowKey;
  /** İç boşluk — varsayılan: spacing.base */
  padding?: number;
  /** Border radius — varsayılan: rs(16) */
  radius?: number;
  /** Arka plan rengi — varsayılan: colors.surface */
  backgroundColor?: string;
  /** Ek stiller */
  style?: ViewStyle;
}

/**
 * Reusable kart bileşeni.
 * Cross-platform shadow, özelleştirilebilir padding/radius.
 *
 * Kullanım:
 *   <Card shadow="md">...</Card>
 *   <Card shadow="lg" radius={20} padding={spacing.lg}>...</Card>
 */
export default function Card({
  children,
  shadow = 'md',
  padding = spacing.base,
  radius = rs(16),
  backgroundColor = colors.surface,
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        shadows[shadow],
        { padding, borderRadius: radius, backgroundColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'visible', // Android shadow için gerekli
  },
});
