import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import CampusQuickActions, { QuickActionItem } from '../components/CampusQuickActions';
import { RootTabParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

type Nav = BottomTabNavigationProp<RootTabParamList, 'Campus'>;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface LifeItem {
  icon: IoniconName;
  title: string;
  description: string;
}

const CAMPUS_LIFE: LifeItem[] = [
  {
    icon: 'library-outline',
    title: 'Kütüphane',
    description:
      'Hafta içi 08:00–20:00, Cumartesi 10:00–18:00 saatleri arasında hizmet veriyor. Sessiz çalışma alanları ve grup çalışma odaları mevcuttur.',
  },
  {
    icon: 'restaurant-outline',
    title: 'Yemekhane',
    description:
      'Öğle arası 11:30–14:30, akşam 17:00–19:30 saatleri arasında ana yemekhane ve kafeteryalarımızdan faydalanabilirsin.',
  },
  {
    icon: 'people-outline',
    title: 'Kulüpler',
    description:
      '20’den fazla öğrenci kulübüyle sosyal, sanatsal ve akademik etkinliklere katıl; kampüs hayatının aktif bir parçası ol.',
  },
  {
    icon: 'bus-outline',
    title: 'Ulaşım',
    description:
      'Kampüs servisleri şehir merkezinden düzenli seferler yapar. Güncel güzergah ve saatler için servis noktalarındaki panoları kontrol et.',
  },
];

export default function CampusScreen() {
  const nav = useNavigation<Nav>();

  const quickLinks = useMemo<QuickActionItem[]>(() => [
    { label: 'Duyurular',      description: 'Güncel bilgilendirmeler', icon: 'bullhorn-outline',        onPress: () => nav.navigate('Home') },
    { label: 'Etkinlikler',    description: 'Kampüste bu hafta',       icon: 'calendar-check-outline',  onPress: () => nav.navigate('Home') },
    { label: 'Bölümler',       description: 'Akademik birimler',       icon: 'view-dashboard-outline',  onPress: () => nav.navigate('Departments') },
    { label: 'Fırsatlar',      description: 'Öğrenci avantajları',     icon: 'tag-outline',             onPress: () => nav.navigate('Opportunities') },
    { label: 'İletişim',       description: 'Bize ulaşın',             icon: 'phone-outline',           onPress: () => nav.navigate('Contact') },
  ], [nav]);

  return (
    <ScreenWrapper backgroundColor={colors.headerBg}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="never"
      >
        <Text style={s.heroTitle}>Kampüste Bugün</Text>
        <Text style={s.heroSubtitle}>
          Yüksek İhtisaslı olarak kampüs hayatının her anına daha yakınsın.
        </Text>

        <Text style={s.sectionTitle}>Kampüs Yaşamı</Text>
        {CAMPUS_LIFE.map(item => (
          <Card key={item.title} shadow="sm" style={s.lifeCard}>
            <View style={s.lifeIconWrap}>
              <Ionicons name={item.icon} size={rs(22)} color={colors.primary} />
            </View>
            <View style={s.lifeTextWrap}>
              <Text style={s.lifeTitle}>{item.title}</Text>
              <Text style={s.lifeDesc}>{item.description}</Text>
            </View>
          </Card>
        ))}

        <CampusQuickActions title="Sık Kullanılan Bağlantılar" items={quickLinks} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  heroTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  heroSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: rs(4),
    marginBottom: spacing.lg,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.md,
  },
  lifeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: rs(16),
    marginBottom: spacing.md,
  },
  lifeIconWrap: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(12),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  lifeTextWrap: { flex: 1 },
  lifeTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: rs(2),
  },
  lifeDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
});
