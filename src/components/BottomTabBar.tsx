import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from './TouchableScale';
import { colors, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';
import { RootTabParamList } from '../navigation/types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<
  keyof RootTabParamList,
  { active: IoniconName; inactive: IoniconName }
> = {
  Home:          { active: 'home',     inactive: 'home-outline' },
  Campus:        { active: 'compass',  inactive: 'compass-outline' },
  Departments:   { active: 'school',   inactive: 'school-outline' },
  Opportunities: { active: 'ribbon',   inactive: 'ribbon-outline' },
  Contact:       { active: 'call',     inactive: 'call-outline' },
};

const TAB_LABELS: Record<keyof RootTabParamList, string> = {
  Home:          'Ana Sayfa',
  Campus:        'Kampüsüm',
  Departments:   'Bölümler',
  Opportunities: 'Fırsatlar',
  Contact:       'İletişim',
};

const BAR_HEIGHT = rs(60);
const BAR_MARGIN_H = rs(16);
const BAR_RADIUS = rs(24);
const TOP_GAP = rs(10);
// Sistem gesture/navigation bar'ı ile floating bar arasına eklenen ekstra
// boşluk — insets.bottom'ın üzerine binerek bar'ı sistem çubuğundan
// gözle görülür şekilde ayırır. Yalnızca insets.bottom'ı kullanmak
// (ör. Math.max(insets.bottom, X)) bazı cihazlarda bar'ı safe-area
// sınırına tam yapıştırıyor, ekstra "nefes payı" bırakmıyordu.
const EXTRA_BOTTOM_GAP = rs(18);

/**
 * Floating görünen bottom tab bar.
 *
 * Bilinçli olarak `position: 'absolute'` KULLANILMIYOR — absolute bir
 * floating bar, üstündeki her ekranın scroll içeriğine bar yüksekliği
 * kadar manuel bottom padding eklemesini gerektirir ve bir ekran bunu
 * unutursa içerik barın altında kaybolur. Bunun yerine bar, React
 * Navigation'ın normal flex akışında kalan gerçek bir layout elemanı —
 * ekran içeriği zaten üstünde flex:1 ile bitiyor, bar kendi doğal
 * yüksekliğini (üst/alt boşluklar dahil) kaplıyor. Görsel olarak
 * "floating" hissi, dıştaki şeffaf konteynerin içine oturan, yuvarlak
 * köşeli, kenarlardan içeri girintili beyaz bar ile elde ediliyor.
 */
export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomGap = insets.bottom + EXTRA_BOTTOM_GAP;

  return (
    <View style={[styles.outer, { paddingTop: TOP_GAP, paddingBottom: bottomGap }]}>
      <View style={[styles.bar, shadows.lg]}>
        {state.routes.map((route, index) => {
          const name = route.name as keyof RootTabParamList;
          const isFocused = state.index === index;
          const icon = isFocused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
          const label = TAB_LABELS[name];
          const tint = isFocused ? colors.primary : colors.textMuted;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableScale
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
              style={styles.item}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons name={icon} size={rs(22)} color={tint} />
              </View>
              <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
                {label}
              </Text>
            </TouchableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.background,
    paddingHorizontal: BAR_MARGIN_H,
  },
  bar: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    backgroundColor: colors.tabBarBg,
    borderRadius: BAR_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(2),
  },
  iconWrap: {
    width: rs(34),
    height: rs(34),
    borderRadius: rs(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primaryFaded,
  },
  label: {
    fontSize: rs(10.5),
    lineHeight: rs(14),
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
});
