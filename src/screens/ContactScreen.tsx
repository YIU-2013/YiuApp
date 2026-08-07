import React, { useCallback, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import TouchableScale from '../components/TouchableScale';
import CampusQuickActions, { QuickActionItem } from '../components/CampusQuickActions';
import { RootTabParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

type Nav = BottomTabNavigationProp<RootTabParamList, 'Contact'>;

const GENERAL_PHONE = '0 (312) 329 10 00';
const GENERAL_EMAIL = 'info@yiu.edu.tr';

export default function ContactScreen() {
  const nav = useNavigation<Nav>();

  const handleCall = useCallback(() => {
    const cleanPhone = GENERAL_PHONE.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Hata', 'Arama gerçekleştirilemedi.');
    });
  }, []);

  const handleEmail = useCallback(() => {
    Linking.openURL(`mailto:${GENERAL_EMAIL}`).catch(() => {
      Alert.alert('Hata', 'E-posta istemcisi açılamadı.');
    });
  }, []);

  const quickLinks = useMemo<QuickActionItem[]>(() => [
    { label: 'Bölümler',   icon: 'view-dashboard-outline', onPress: () => nav.navigate('Departments') },
    { label: 'Kampüsüm',   icon: 'compass-outline',        onPress: () => nav.navigate('Campus') },
    { label: 'Fırsatlar',  icon: 'tag-outline',            onPress: () => nav.navigate('Opportunities') },
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
        <Text style={s.heroTitle}>Bize Ulaş</Text>
        <Text style={s.heroSubtitle}>
          Sorularını, önerilerini ve destek taleplerini bize iletebilirsin.
        </Text>

        <Card shadow="sm" style={s.infoCard}>
          <Text style={s.sectionTitle}>Genel İletişim</Text>
          <View style={s.contactList}>
            <TouchableScale style={s.contactRow} onPress={handleCall}>
              <View style={s.contactIconWrap}>
                <Ionicons name="call" size={rs(16)} color={colors.primary} />
              </View>
              <View style={s.contactTextWrap}>
                <Text style={s.contactLabel}>Telefon</Text>
                <Text style={s.contactValue}>{GENERAL_PHONE}</Text>
              </View>
            </TouchableScale>

            <TouchableScale style={s.contactRow} onPress={handleEmail}>
              <View style={s.contactIconWrap}>
                <Ionicons name="mail" size={rs(16)} color={colors.primary} />
              </View>
              <View style={s.contactTextWrap}>
                <Text style={s.contactLabel}>E-Posta</Text>
                <Text style={s.contactValue}>{GENERAL_EMAIL}</Text>
              </View>
            </TouchableScale>

            <View style={s.contactRow}>
              <View style={s.contactIconWrap}>
                <Ionicons name="location-outline" size={rs(16)} color={colors.primary} />
              </View>
              <View style={s.contactTextWrap}>
                <Text style={s.contactLabel}>Adres</Text>
                <Text style={s.contactValue}>Yüksek İhtisas Üniversitesi, Ankara</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card shadow="sm" style={s.infoCard}>
          <View style={s.supportRow}>
            <View style={s.supportIconWrap}>
              <Ionicons name="chatbubble-ellipses-outline" size={rs(22)} color={colors.primary} />
            </View>
            <View style={s.contactTextWrap}>
              <Text style={s.supportTitle}>Öğrenci Destek Hattı</Text>
              <Text style={s.supportDesc}>
                Kayıt, akademik takvim ve kampüs hayatıyla ilgili sorularında Öğrenci İşleri
                Daire Başkanlığı sana yardımcı olmaktan mutluluk duyar.
              </Text>
            </View>
          </View>
        </Card>

        <CampusQuickActions title="Hızlı Erişim" items={quickLinks} />
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

  infoCard: {
    marginBottom: spacing.md,
    borderRadius: rs(20),
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: spacing.xs,
  },
  contactList: { gap: spacing.xs },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconWrap: {
    width: rs(30),
    height: rs(30),
    borderRadius: rs(6),
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactTextWrap: { flex: 1 },
  contactLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.caps,
  },
  contactValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginTop: rs(1),
  },

  supportRow: { flexDirection: 'row', alignItems: 'flex-start' },
  supportIconWrap: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(12),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  supportTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: rs(2),
  },
  supportDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
});
