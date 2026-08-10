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

// İkon + label için ayrılan iç alan (safe-area hariç). rs(56) hem ikonu hem
// de tek satır label'ı overflow olmadan rahatça barındırıyor.
const CONTENT_HEIGHT = rs(56);
const PADDING_TOP = rs(8);
// insets.bottom bazı Android cihazlarda (3 tuşlu nav bar, edge-to-edge
// kapalı) 0 dönebiliyor — taban değer tab bar'ın sistem çubuğuna
// yapışmasını engelliyor.
const MIN_BOTTOM_INSET = rs(14);

/**
 * Varsayılan React Navigation bottom-tab bar yerine kullanılan, tamamen
 * kontrollü custom tab bar. Label/ikon kırpılmasını kesin olarak önlemek
 * için sabit `overflow: hidden` YOK, negatif margin YOK — her elemanın
 * kendi doğal boyutu kadar yer kaplamasına izin veriliyor.
 */
export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomSafe = Math.max(insets.bottom, MIN_BOTTOM_INSET);
  const barHeight = CONTENT_HEIGHT + PADDING_TOP + bottomSafe;

  return (
    <View style={[styles.bar, shadows.tabBar, { height: barHeight, paddingBottom: bottomSafe }]}>
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
            {isFocused && <View style={styles.activeIndicator} />}
            <Ionicons name={icon} size={rs(22)} color={tint} />
            <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
              {label}
            </Text>
          </TouchableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
    paddingTop: PADDING_TOP,
  },
  item: {
    flex: 1,
    height: CONTENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(3),
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: rs(22),
    height: rs(3),
    borderRadius: rs(2),
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: rs(10.5),
    lineHeight: rs(14),
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
});
