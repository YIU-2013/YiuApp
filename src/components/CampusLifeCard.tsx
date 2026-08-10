import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import TouchableScale from './TouchableScale';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

interface CampusLifeCardProps {
  onPress: () => void;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const MINI_ITEMS: { icon: IoniconName; label: string }[] = [
  { icon: 'library-outline', label: 'Kütüphane' },
  { icon: 'people-outline',  label: 'Kulüpler' },
  { icon: 'bus-outline',     label: 'Ulaşım' },
];

/**
 * Ana Sayfa'da öğrenciyi Kampüsüm sekmesine yönlendiren açık zeminli kart.
 * FeaturedSlider'ın koyu, dekoratif "hero" diliyle bilinçli olarak
 * ayrışıyor — lacivert yalnızca ikon/vurgu, kırmızı yalnızca CTA'da
 * minimal bir dokunuş olarak kullanılıyor.
 */
export default function CampusLifeCard({ onPress }: CampusLifeCardProps) {
  return (
    <TouchableScale onPress={onPress}>
      {/* padding={0}: iç boşluk s.content'e taşındı — s.clip'in overflow:hidden'ı
          yalnızca dekoratif daireyi kırpar, Card'ın kendi gölgesini (Android'de
          elevation) etkilemez (bkz. Card.tsx — shadow-bearing view her zaman
          overflow:'visible' kalmalı). */}
      <Card shadow="sm" padding={0} style={s.card}>
        <View style={s.clip}>
          <View style={s.decorCircle} pointerEvents="none" />

          <View style={s.content}>
            <View style={s.headerRow}>
              <View style={s.iconWrap}>
                <Ionicons name="compass" size={rs(18)} color={colors.primary} />
              </View>
              <View style={s.headerText}>
                <Text style={s.title}>Kampüste Yaşam</Text>
                <Text style={s.desc}>
                  Etkinlikleri, öğrenci fırsatlarını ve kampüs olanaklarını tek yerden keşfet.
                </Text>
              </View>
            </View>

            <View style={s.chipRow}>
              {MINI_ITEMS.map(mi => (
                <View key={mi.label} style={s.chip}>
                  <View style={s.chipIconWrap}>
                    <Ionicons name={mi.icon} size={rs(16)} color={colors.primary} />
                  </View>
                  <Text style={s.chipLabel}>{mi.label}</Text>
                </View>
              ))}
            </View>

            <View style={s.ctaRow}>
              <Text style={s.ctaText}>Kampüsüm’e Git</Text>
              <View style={s.ctaArrowWrap}>
                <Ionicons name="arrow-forward" size={rs(13)} color={colors.textInverse} />
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableScale>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: rs(18),
    marginBottom: spacing.md,
  },
  clip: {
    borderRadius: rs(18),
    overflow: 'hidden',
  },
  content: {
    padding: spacing.base,
  },
  decorCircle: {
    position: 'absolute',
    top: -rs(30),
    right: -rs(20),
    width: rs(90),
    height: rs(90),
    borderRadius: rs(45),
    backgroundColor: colors.primaryFaded,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconWrap: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(12),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textBrand,
    letterSpacing: typography.letterSpacing.tight,
  },
  desc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    marginTop: rs(2),
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: rs(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing.sm,
    gap: rs(6),
  },
  chipIconWrap: {
    width: rs(30),
    height: rs(30),
    borderRadius: rs(10),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  ctaArrowWrap: {
    width: rs(28),
    height: rs(28),
    borderRadius: rs(14),
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
