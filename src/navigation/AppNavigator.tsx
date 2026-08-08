import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import DepartmentStack from './DepartmentStack';
import CampusScreen from '../screens/CampusScreen';
import OpportunitiesScreen from '../screens/OpportunitiesScreen';
import ContactScreen from '../screens/ContactScreen';
import { RootTabParamList } from './types';
import { colors, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';

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

const Tab = createBottomTabNavigator<RootTabParamList>();

// İkon + label için ayrılan içerik alanı (safe-area/inset hariç) — ikon (24) +
// label (satır yüksekliği ~14) + aralarındaki boşluklar rahatça sığacak kadar
// geniş tutuluyor, aksi halde Android'de fontun ekstra satır boşluğu
// (includeFontPadding) label'ı alttan kırpabiliyor.
const TAB_ICON_SIZE = rs(24);
const TAB_BAR_CONTENT_HEIGHT = rs(50);
const TAB_BAR_PADDING_TOP = rs(8);
// Sistem gesture/navigation bar'ı ile tab bar arasında her zaman görünür bir
// nefes payı bırakmak için taban değer — insets.bottom bazı Android
// cihazlarda (3 tuşlu nav bar, edge-to-edge kapalı) 0 dönebiliyor, bu durumda
// tab bar sistem çubuğuna yapışık görünüyordu.
const TAB_BAR_MIN_BOTTOM_INSET = rs(12);

export default function AppNavigator() {
  // Android gesture/navigation bar ve iOS home-indicator yüksekliği cihazdan
  // cihaza değişir — sabit paddingBottom yerine gerçek safe-area inset'i
  // kullanılıyor ki tab bar sistem çubuğuyla çakışmasın veya gereksiz
  // yüksek durmasın.
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(insets.bottom, TAB_BAR_MIN_BOTTOM_INSET);
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + TAB_BAR_PADDING_TOP + tabBarPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const name = route.name as keyof RootTabParamList;
          const icon = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
          return <Ionicons name={icon} size={TAB_ICON_SIZE} color={color} />;
        },
        tabBarLabel: TAB_LABELS[route.name as keyof RootTabParamList],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          { height: tabBarHeight, paddingBottom: tabBarPaddingBottom },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Campus" component={CampusScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Departments"
        component={DepartmentStack}
        options={{ title: 'Bölümler', headerShown: false }}
      />
      <Tab.Screen name="Opportunities" component={OpportunitiesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
    paddingTop: TAB_BAR_PADDING_TOP,
    ...shadows.tabBar,
  },
  tabBarLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xs * 1.4,
    letterSpacing: typography.letterSpacing.wide,
    marginTop: rs(2),
    marginBottom: 0,
  },
  tabBarIcon: {
    marginTop: 0,
    marginBottom: rs(2),
  },
  tabBarItem: {
    height: TAB_BAR_CONTENT_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.headerBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
});
