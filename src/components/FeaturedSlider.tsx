import React, { useCallback, useMemo, useState } from 'react';
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
import { rs } from '../utils/responsive';

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
  /** Verilirse carousel'in üstünde başlık satırı render edilir */
  title?: string;
  /** title ile birlikte verilirse başlığın yanında bir buton render edilir */
  onSeeAll?: () => void;
  seeAllLabel?: string;
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

// Fotoğrafın üstünde metni okunaklı kılan, alta doğru koyulaşan lacivert
// scrim (navy950 tonu).
const SCRIM_OPACITIES = buildOpacitySteps(0.82);
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

// ─── M3 "Uncontained multi-aspect ratio" carousel ölçüleri ────────────────────
// bkz. https://m3.material.io/components/carousel/specs
// Sabit satır yüksekliği + döngüsel en-boy oranı dizisi ile her kart farklı
// genişlikte render edilir (spec'teki örnek sırayla birebir: 16:9, 9:16,
// 1:1, 3:4). Yalnızca "leading" (sol) padding var — sağda padding yok,
// kartlar konteynerin kenarından taşarak (uncontained) kayar.
const ROW_HEIGHT = rs(200);
const ITEM_RADIUS = rs(28); // M3 spec: "Item corner radius: 28dp"
const GAP = spacing.sm; // M3 spec: "Padding between elements: 8dp"
const LEADING_PADDING = spacing.base; // M3 spec: "Leading padding: 16dp"
const ASPECT_RATIOS = [16 / 9, 9 / 16, 1 / 1, 3 / 4];

/**
 * Ana Sayfa'da öğrenciye özel öne çıkan içerikleri (duyuru/etkinlik/fırsat/
 * kampüs) gösteren, Material Design 3 "Uncontained multi-aspect ratio"
 * carousel deseni. Her kart, spec'teki döngüsel en-boy oranına (16:9, 9:16,
 * 1:1, 3:4) göre sabit satır yüksekliğinden dinamik genişlik alır; konteyner
 * yalnızca sol tarafta dolgu bırakır, kartlar sağ kenardan taşarak kayar.
 *
 * Dar (en-boy oranı < 1) kartlarda metin içeriği daralan alana sığması için
 * yalnızca ikon rozeti + başlığa indirgenir; geniş kartlarda rozet, başlık,
 * açıklama ve CTA tam olarak gösterilir.
 *
 * Boş `slides` dizisi güvenle ele alınır (render edilmez, hata atmaz).
 */
export default function FeaturedSlider({ slides, title, onSeeAll, seeAllLabel = 'TÜMÜNÜ GÖR' }: FeaturedSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const itemWidths = useMemo(
    () => slides.map((_, i) => Math.round(ROW_HEIGHT * ASPECT_RATIOS[i % ASPECT_RATIOS.length])),
    [slides.length]
  );

  // Her kartın "dinlenme" konumundaki sol kenarını viewport'un sol kenarına
  // (padding hariç) hizalayan snap noktaları — M3'teki "sonraki kart her
  // zaman kenara yaslanır" davranışını taklit eder.
  const offsets = useMemo(() => {
    const arr: number[] = [0];
    let acc = LEADING_PADDING;
    itemWidths.forEach((w, i) => {
      acc += w + GAP;
      if (i < itemWidths.length - 1) arr.push(acc);
    });
    return arr;
  }, [itemWidths]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (offsets.length === 0) return;
      const x = e.nativeEvent.contentOffset.x;
      const idx = offsets.reduce(
        (best, off, i) => (Math.abs(off - x) < Math.abs(offsets[best] - x) ? i : best),
        0
      );
      setActiveIndex(prev => (prev === idx ? prev : idx));
    },
    [offsets]
  );

  if (slides.length === 0) return null;

  return (
    <View style={s.wrapper}>
      {title && (
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>{title}</Text>
          {onSeeAll && (
            <TouchableScale onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.headerCta}>{seeAllLabel}</Text>
            </TouchableScale>
          )}
        </View>
      )}

      <View style={s.bleed}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToOffsets={offsets}
          contentContainerStyle={s.scrollContent}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide, i) => {
            const meta = TYPE_META[slide.type];
            const ratio = ASPECT_RATIOS[i % ASPECT_RATIOS.length];
            const compact = ratio < 1;
            const isLast = i === slides.length - 1;

            const content = compact ? (
              <>
                <View style={s.iconBadge}>
                  <Ionicons name={meta.icon} size={rs(14)} color={meta.accent} />
                </View>
                <Text style={s.compactTitle} numberOfLines={3}>{slide.title}</Text>
              </>
            ) : (
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
                style={[s.cardShell, shadows.md, { width: itemWidths[i], marginRight: isLast ? 0 : GAP }]}
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
      </View>

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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerCta: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.caps,
  },

  // Ebeveynin (HomeScreen listContent) yatay padding'ini iptal edip yerine
  // yalnızca M3 spec'teki "leading padding: 16dp"yi koyuyor — sağda padding
  // yok, kartlar konteynerin sağ kenarından taşarak (uncontained) kayabiliyor.
  bleed: { marginHorizontal: -spacing.base },
  scrollContent: { paddingLeft: LEADING_PADDING, paddingVertical: spacing.sm },

  cardShell: {
    height: ROW_HEIGHT,
    borderRadius: ITEM_RADIUS,
  },
  card: {
    flex: 1,
    borderRadius: ITEM_RADIUS,
    overflow: 'hidden',
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  cardImage: {
    borderRadius: ITEM_RADIUS,
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

  // Dar (en-boy oranı < 1) kartlarda tam rozet+açıklama+CTA sığmadığı için
  // kullanılan sadeleştirilmiş içerik: yalnızca ikon rozeti + başlık.
  iconBadge: {
    width: rs(26),
    height: rs(26),
    borderRadius: rs(13),
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  compactTitle: {
    color: colors.textInverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.sizes.sm * typography.lineHeights.snug,
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
