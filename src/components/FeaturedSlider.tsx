import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ImageSourcePropType,
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
  type: FeaturedSlideType;
  /** Verilmezse type'a göre varsayılan CTA metni kullanılır */
  ctaLabel?: string;
  /**
   * Verilirse kart bu fotoğrafı arka plan yapar. Verilmezse kampüsün gerçek
   * fotoğrafı (assets/images/campus.png) varsayılan arka plan olarak
   * kullanılır — kart hiçbir zaman düz renk/gradient bir yüzey olarak
   * kalmaz, her zaman fotoğraf destekli render edilir.
   */
  image?: ImageSourcePropType;
  onPress: () => void;
}

interface FeaturedSliderProps {
  slides: FeaturedSlide[];
}

// Slide için görsel verilmediğinde kullanılan varsayılan arka plan fotoğrafı
// — proje genelinde mevcut tek gerçek kampüs fotoğrafı. Böylece kart hiçbir
// zaman düz lacivert/gradient bir yüzey olarak kalmaz.
const DEFAULT_IMAGE = require('../../assets/images/campus.png');

const DEFAULT_CTA: Record<FeaturedSlideType, string> = {
  announcement: 'Detayları Gör',
  event: 'Etkinliği Görüntüle',
  opportunity: 'Fırsatı İncele',
  campus: 'Keşfet',
};

// Gerçek bir gradient kütüphanesi olmadan (yeni dependency yasak), çok
// sayıda ince bant üst üste dizilip her birinin opaklığı bir öncekinden
// yalnızca birkaç puan farklı tutularak "pürüzsüz" bir gradient hissi
// simüle ediliyor. Az sayıda (3-4) kalın bant kullanmak sert kenarlı,
// "yatay çizgi/bant" gibi görünen kötü bir sonuç veriyordu — bu yüzden
// adım sayısı yüksek tutuluyor.
const BAND_STEPS = 16;
function buildOpacitySteps(max: number, exponent = 1.7): number[] {
  return Array.from({ length: BAND_STEPS }, (_, i) => {
    const t = i / (BAND_STEPS - 1);
    return +(max * Math.pow(t, exponent)).toFixed(3);
  });
}

// Fotoğrafın üstünde başlık/butonu her koşulda okunaklı kılan, alta doğru
// koyulaşan lacivert scrim (navy950 tonu). Üst sınır 0.92 — parlak/açık
// renkli fotoğraflarda dahi alttaki metin bloğunun arkası yeterince koyu
// kalsın diye.
const SCRIM_OPACITIES = buildOpacitySteps(0.92);

function GradientScrim() {
  const stepPct = 100 / SCRIM_OPACITIES.length;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {SCRIM_OPACITIES.map((o, i) => (
        <View
          key={i}
          style={[
            s.band,
            { top: `${i * stepPct}%`, height: `${stepPct + 0.5}%`, backgroundColor: `rgba(7,27,66,${o})` },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Ana Sayfa'da öğrenciye özel öne çıkan içerikleri (duyuru/etkinlik/fırsat/
 * kampüs) gösteren, tek odaklı, tam genişlikte kaydırmalı slider. Her
 * ekranda yalnızca tek bir ana kart odakta olur — bir sonraki kart tamamen
 * kaydırılana kadar görünmez, kartlar birbiriyle her zaman eşit boyuttadır
 * (büyük/küçük ayrımı yok).
 *
 * Kartlar her zaman fotoğraf destekli render edilir (`slide.image` yoksa
 * kampüsün gerçek fotoğrafı varsayılan olarak kullanılır) ve içerik
 * yalnızca başlık + tek bir CTA butonundan oluşur — rozet veya açıklama
 * metni yok, böylece kart sade ve okunaklı kalır.
 *
 * Boş `slides` dizisi güvenle ele alınır (render edilmez, hata atmaz).
 */
export default function FeaturedSlider({ slides }: FeaturedSliderProps) {
  const { width } = useResponsive();
  const CARD_W = width - spacing.base * 2;
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
          const isLast = i === slides.length - 1;

          return (
            <TouchableScale
              key={slide.id}
              onPress={slide.onPress}
              style={[s.cardShell, shadows.md, { width: CARD_W, marginRight: isLast ? 0 : GAP }]}
            >
              <ImageBackground
                source={slide.image ?? DEFAULT_IMAGE}
                style={s.card}
                imageStyle={s.cardImage}
                resizeMode="cover"
              >
                <GradientScrim />
                <View style={s.bottomBlock}>
                  <Text style={s.title} numberOfLines={2}>{slide.title}</Text>
                  <View style={s.ctaPill}>
                    <Text style={s.ctaText}>{slide.ctaLabel ?? DEFAULT_CTA[slide.type]}</Text>
                    <Ionicons name="arrow-forward" size={rs(13)} color={colors.primary} />
                  </View>
                </View>
              </ImageBackground>
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

  cardShell: {
    height: rs(192),
    borderRadius: rs(20),
  },
  card: {
    flex: 1,
    borderRadius: rs(20),
    overflow: 'hidden',
    padding: spacing.base,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: rs(20),
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  bottomBlock: {},
  title: {
    color: colors.textInverse,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.sizes.xl * typography.lineHeights.snug,
  },
  ctaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.textInverse,
    borderRadius: rs(100),
    paddingHorizontal: spacing.md,
    paddingVertical: rs(6),
    marginTop: spacing.md,
  },
  ctaText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
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
