import React from 'react';
import { View, StyleSheet, Text, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

export const HEADER_HEIGHT = rs(56);

interface ScreenHeaderProps {
  rightElement?: React.ReactNode;
}

const LOGO: ImageSourcePropType = require('../../assets/images/logo.png');

export default function ScreenHeader({ rightElement }: ScreenHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top, height: HEADER_HEIGHT + top }]}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <ExpoImage
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            transition={0}
            accessibilityLabel="Yüksek İhtisas Üniversitesi logosu"
          />
          <View style={styles.titles}>
            <Text style={styles.uniName}>Yüksek İhtisas</Text>
            <Text style={styles.uniSub}>ÜNİVERSİTESİ · ANKARA</Text>
          </View>
        </View>
        {rightElement && <View style={styles.rightAction}>{rightElement}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    justifyContent: 'flex-end',
  },
  content: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    height: rs(38),
    width: rs(38),
    marginRight: spacing.sm,
  },
  titles: {
    justifyContent: 'center',
  },
  uniName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  uniSub: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    letterSpacing: typography.letterSpacing.wide,
    marginTop: rs(1),
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
