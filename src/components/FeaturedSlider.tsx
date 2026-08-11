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
  description: string;
  /** Verilmezse type'a göre varsayılan rozet metni kullanılır */
  badge?: string;
  type: FeaturedSlideType;
  /** Verilmezse type'a göre varsayılan CTA metni kullanılır */
  ctaLabel?: string;
  /**
   * Verilirse kart fotoğraf arka planlı render edilir (koyu gradient
   * overlay + üzerinde metin). Verilmezse kart görsel geldiğinde birebir
   * aynı yapıyı kullanabilecek şekilde tasarlanmış, fotoğrafsız "soft
   * gradient" fallback ile render edilir — asla hata atmaz.
   */
  image?: ImageSourcePropType;
  onPress: () => void;
}

interface FeaturedSliderProps {
  slides: FeaturedSlide[];
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// Kategori ayrımı yalnızca küçük badge ikonu/metniyle yapılıyor — kartın
// kendisi (fotoğraflı ya da fallback) her zaman kurumsal lacivert temelli;
// böylece kırmızı yalnızca "Etkinlik" badge'inde küçük bir vurgu olarak
// kalıyor, büyük bir kırmızı blok hiçbir zaman oluşmuyor.
const TYPE_META: Record<FeaturedSlideType, { accent: string; icon: IoniconName; badge: string; cta: string }> = {
  announcement: { accent: colors.primary, icon: 'megaphone-outline', badge: 'Duyuru',   cta: 'Detayları Gör' },
  event:        { accent: colors.accent,  icon: 'calendar-outline',  badge: 'Etkinlik', cta: 'Etkinliği Görüntüle' },
  opportunity:  { accent: colors.success, icon: 'pricetag-outline',  badge: 'Fırsat',    cta: 'Fırsatı İncele' },
  campus:       { accent: colors.info,    icon: 'compass-outline',   badge: 'Kampüs',    cta: 'Keşfet' },
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

function GradientBands({ rgb, opacities }: { rgb: string; opacities: number[] }) {
  const stepPct = 100 / opacities.length;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {opacities.map((o, i) => (
        <View
          key={i}
          style={[
            s.band,
            { top: `${i * stepPct}%`, height: `${stepPct + 0.5}%`, backgroundColor: `rgba(${rgb},${o})` },
          ]}
        />
      ))}
    </View>
  );
}

// Fotoğrafın üstünde metni her koşulda okunaklı kılan, alta doğru koyulaşan
// lacivert scrim (navy950 tonu). Üst sınır 0.92'ye çıkarıldı — parlak/açık
// renkli fotoğraflarda dahi alttaki başlık/açıklama bloğunun arkası yeterince
// koyu kalsın diye (önceki 0.82 bazı fotoğraflarda metni zayıflatıyordu).
const SCRIM_OPACITIES = buildOpacitySteps(0.92);
/** Fotoğraf yokken kullanılan, düz tek renk yerine geçen soft gradient
 * dolgu — açık lacivertten koyu laciverte pürüzsüz geçiş. */
const FILL_OPACITIES = buildOpacitySteps(0.9, 1.4);

function GradientScrim() {
  return <GradientBands rgb="7,27,66" opacities={SCRIM_OPACITIES} />;
}

function GradientFill() {
  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#3D6BC0' }]} pointerEvents="none" />
      <GradientBands rgb="11,46,107" opacities={FILL_OPACITIES} />
    </>
  );
}

/**
 * Ana Sayfa'da öğrenciye özel öne çıkan içerikleri (duyuru/etkinlik/fırsat/
 * kampüs) gösteren, tek odaklı, tam genişlikte kaydırmalı slider. Her
 * ekranda yalnızca tek bir ana kart odakta olur — bir sonraki kart tamamen
 * kaydırılana kadar görünmez, böylece kartlar hiçbir zaman dar/okunaksız
 * bir önizleme şeridine dönüşmez.
 *
 * `slide.image` verilirse fotoğraf + gradient overlay, verilmezse aynı
 * yapıda fotoğrafsız gradient fallback render edilir — component her iki
 * durumda da hatasız çalışır.
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
          const meta = TYPE_META[slide.type];
          const isLast = i === slides.length - 1;

          const content = (
            <>
              <View style={s.badgeRow}>
                <Ionicons name={meta.icon} size={rs(12)} color={meta.accent} />
                <Text style={[s.badgeText, { color: meta.accent }]}>{slide.badge ?? meta.badge}</Text>
              </View>

              <View style={s.bottomBlock}>
                <Text style={s.title} numberOfLines={2}>{slide.title}</Text>
                <Text style={s.desc} numberOfLines={2}>{slide.description}</Text>

                <View style={s.ctaRow}>
                  <Text style={s.ctaText}>{slide.ctaLabel ?? meta.cta}</Text>
                  <Ionicons name="arrow-forward" size={rs(13)} color={colors.primary} />
                </View>
              </View>
            </>
          );

          return (
            <TouchableScale
              key={slide.id}
              onPress={slide.onPress}
              style={[s.cardShell, shadows.md, { width: CARD_W, marginRight: isLast ? 0 : GAP }]}
            >
              {slide.image ? (
                <ImageBackground source={slide.image} style={s.card} imageStyle={s.cardImage} resizeMode="cover">
                  <GradientScrim />
                  {content}
                </ImageBackground>
              ) : (
                <View style={s.card}>
                  <GradientFill />
                  <Ionicons
                    name={meta.icon}
                    size={rs(120)}
                    color="rgba(255,255,255,0.12)"
                    style={s.watermarkIcon}
                    pointerEvents="none"
                  />
                  {content}
                </View>
              )}
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
    justifyContent: 'space-between',
  },
  cardImage: {
    borderRadius: rs(20),
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  watermarkIcon: {
    position: 'absolute',
    top: -rs(20),
    right: -rs(20),
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: rs(4),
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
  },
  badgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.caps,
  },

  bottomBlock: {},
  title: {
    color: colors.textInverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.sizes.lg * typography.lineHeights.snug,
  },
  desc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    marginTop: rs(3),
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.textInverse,
    borderRadius: rs(100),
    paddingHorizontal: spacing.md,
    paddingVertical: rs(6),
    marginTop: spacing.sm,
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
