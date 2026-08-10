import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from './TouchableScale';
import { colors, spacing, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';

interface CampusLifeCardProps {
  onPress: () => void;
}

/**
 * Ana Sayfa'da öğrenciyi Kampüsüm sekmesine yönlendiren kompakt, premium
 * kart. Aidiyet hissi bir slogan yerine somut bir davetle veriliyor —
 * VideoCard/FeaturedSlider ile aynı dekoratif görsel dili paylaşır.
 */
export default function CampusLifeCard({ onPress }: CampusLifeCardProps) {
  return (
    <TouchableScale onPress={onPress} style={[s.card, shadows.brand]}>
      <View style={s.circleLg} />
      <View style={s.circleSm} />

      <View style={s.badgeRow}>
        <Ionicons name="compass" size={rs(13)} color={colors.textInverse} />
        <Text style={s.badgeText}>KAMPÜS YAŞAMI</Text>
      </View>

      <Text style={s.title}>Kampüste Yaşam</Text>
      <Text style={s.desc}>
        Etkinlikleri, öğrenci fırsatlarını ve kampüs olanaklarını tek yerden keşfet.
      </Text>

      <View style={s.ctaRow}>
        <Text style={s.ctaText}>Kampüsüm’e Git</Text>
        <Ionicons name="arrow-forward" size={rs(13)} color={colors.textInverse} />
      </View>
    </TouchableScale>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: rs(18),
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  circleLg: {
    position: 'absolute',
    top: -rs(45),
    right: -rs(30),
    width: rs(130),
    height: rs(130),
    borderRadius: rs(65),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleSm: {
    position: 'absolute',
    bottom: -rs(22),
    right: rs(40),
    width: rs(56),
    height: rs(56),
    borderRadius: rs(28),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: rs(4),
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(3),
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.caps,
  },
  title: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  desc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    marginTop: rs(4),
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(4),
    marginTop: spacing.sm,
  },
  ctaText: {
    color: colors.textInverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
