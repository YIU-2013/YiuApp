import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from './TouchableScale';
import { colors, spacing, typography, shadows } from '../theme';
import { rs, useResponsive } from '../utils/responsive';

export type FeaturedSlideType = 'announcement' | 'opportunity' | 'event' | 'campus';

export interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  /** Verilmezse type'a göre varsayılan rozet metni kullanılır */
  badge?: string;
  type: FeaturedSlideType;
  /** Verilmezse type'a göre varsayılan CTA metni kullanılır */
  ctaLabel?: string;
  onPress: () => void;
}

interface FeaturedSliderProps {
  slides: FeaturedSlide[];
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TYPE_META: Record<FeaturedSlideType, { bg: string; icon: IoniconName; badge: string; cta: string }> = {
  announcement: { bg: colors.primary,   icon: 'megaphone-outline', badge: 'Duyuru',   cta: 'Detayları Gör' },
  event:        { bg: colors.accent,    icon: 'calendar-outline',  badge: 'Etkinlik', cta: 'Etkinliği Görüntüle' },
  opportunity:  { bg: colors.success,   icon: 'pricetag-outline',  badge: 'Fırsat',    cta: 'Fırsatı İncele' },
  campus:       { bg: colors.info,      icon: 'compass-outline',   badge: 'Kampüs',    cta: 'Keşfet' },
};

/**
 * Ana Sayfa'da (ve gerekirse başka ekranlarda) öğrenciye özel öne çıkan
 * içerikleri (duyuru/etkinlik/fırsat/kampüs) gösteren yatay kaydırmalı,
 * data-driven slider. Görsel yoksa type'a göre tema renkli, dekoratif
 * katmanlı "premium" kart (VideoCard/CampusLifeCard ile aynı
 * görsel dil) fallback olarak kullanılır.
 *
 * Boş `slides` dizisi güvenle ele alınır (render edilmez, hata atmaz).
 */
export default function FeaturedSlider({ slides }: FeaturedSliderProps) {
  const { width } = useResponsive();
  // Kart genişliği ekran genişliğinin (container değil) %83'ü — sağda
  // görünen bir sonraki kartın "preview" payı bilinçli olarak dar
  // tutuluyor, aksi halde ikinci (kırmızı) kart fazla baskın görünüyordu.
  const CARD_W = Math.round(width * 0.83);
  const GAP = spacing.sm;
  const SNAP = CARD_W + GAP;

  const [activeIndex, setActiveIndex] = useState(0);

  // Hem sürükleme sırasında (onScroll) hem de bırakıldığında
  // (onMomentumScrollEnd) çalışır — yalnızca momentum-end'e güvenmek
  // web/trackpad kaydırmada dot senkronunun kopmasına yol açıyordu.
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (SNAP <= 0) return;
      const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP);
      const clamped = Math.max(0, Math.min(idx, slides.length - 1));
      setActiveIndex(prev => (prev === clamped ? prev : clamped));
    },
    [SNAP, slides.length]
  );

  if (slides.length === 0) return null;

  return (
    <View style={s.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP}
        snapToAlignment="start"
        contentContainerStyle={s.scrollContent}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, i) => {
          const meta = TYPE_META[slide.type];
          const isLast = i === slides.length - 1;
          return (
            <TouchableScale
              key={slide.id}
              onPress={slide.onPress}
              style={[
                s.card,
                shadows.md,
                { width: CARD_W, marginRight: isLast ? 0 : GAP, backgroundColor: meta.bg },
              ]}
            >
              <View style={s.circleLg} />
              <View style={s.circleSm} />

              <View style={s.badgeRow}>
                <Ionicons name={meta.icon} size={rs(13)} color={colors.textInverse} />
                <Text style={s.badgeText}>{slide.badge ?? meta.badge}</Text>
              </View>

              <Text style={s.title} numberOfLines={2}>{slide.title}</Text>
              <Text style={s.desc} numberOfLines={1}>{slide.description}</Text>

              <View style={s.ctaRow}>
                <Text style={s.ctaText}>{slide.ctaLabel ?? meta.cta}</Text>
                <Ionicons name="arrow-forward" size={rs(13)} color={colors.textInverse} />
              </View>
            </TouchableScale>
          );
        })}
      </ScrollView>

      {slides.length > 1 && (
        <View style={s.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  scrollContent: { paddingRight: spacing.base },

  card: {
    height: rs(142),
    borderRadius: rs(20),
    padding: spacing.base,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  circleLg: {
    position: 'absolute',
    top: -rs(46),
    right: -rs(30),
    width: rs(120),
    height: rs(120),
    borderRadius: rs(60),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleSm: {
    position: 'absolute',
    bottom: -rs(20),
    right: rs(28),
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: rs(4),
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(3),
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
    lineHeight: typography.sizes.md * typography.lineHeights.snug,
    marginTop: rs(6),
  },
  desc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    marginTop: rs(2),
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
  },
  ctaText: {
    color: colors.textInverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rs(6),
    marginTop: spacing.sm,
  },
  dot: {
    width: rs(6),
    height: rs(6),
    borderRadius: rs(3),
    backgroundColor: colors.border,
  },
  dotActive: {
    width: rs(18),
    backgroundColor: colors.primary,
  },
});
