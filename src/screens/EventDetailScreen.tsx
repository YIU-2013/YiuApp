import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import { HomeStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route }: Props) {
  const { event: e } = route.params;

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="never"
      >
        {/* Tarih Kartı */}
        <Card shadow="md" style={s.dateCard}>
          <View style={s.dateBox}>
            <Text style={s.dateDay}>{e.day}</Text>
            <Text style={s.dateMonth}>{e.month} {e.year}</Text>
          </View>
        </Card>

        {/* Başlık */}
        <Text style={s.title}>{e.title}</Text>

        {/* Kategori */}
        {e.category && (
          <View style={s.categoryWrap}>
            <View style={s.categoryBadge}>
              <Text style={s.categoryText}>{e.category}</Text>
            </View>
          </View>
        )}

        {/* Meta Bilgiler */}
        <View style={s.metaList}>
          <View style={s.metaRow}>
            <View style={s.metaIcon}>
              <Ionicons name="time-outline" size={rs(18)} color={colors.primary} />
            </View>
            <View>
              <Text style={s.metaLabel}>Saat</Text>
              <Text style={s.metaValue}>
                {e.time}{e.endTime ? ` – ${e.endTime}` : ''}
              </Text>
            </View>
          </View>
          <View style={s.metaRow}>
            <View style={s.metaIcon}>
              <Ionicons name="location-outline" size={rs(18)} color={colors.primary} />
            </View>
            <View>
              <Text style={s.metaLabel}>Konum</Text>
              <Text style={s.metaValue}>{e.location}</Text>
            </View>
          </View>
        </View>

        {/* Ayraç */}
        <View style={s.divider} />

        {/* Açıklama */}
        <Text style={s.sectionTitle}>Etkinlik Hakkında</Text>
        <Text style={s.body}>{e.description}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  dateCard: {
    marginBottom: spacing.base,
    borderRadius: rs(16),
    alignSelf: 'flex-start',
  },
  dateBox: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  dateDay: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.extrabold,
    color: colors.accent,
    lineHeight: typography.sizes.xxxl * 1.1,
  },
  dateMonth: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: typography.sizes.xxl * typography.lineHeights.snug,
    marginBottom: spacing.sm,
  },
  categoryWrap: { marginBottom: spacing.base },
  categoryBadge: {
    backgroundColor: colors.iconBg,
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  metaList: {
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  metaIcon: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(10),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
    marginBottom: rs(2),
  },
  metaValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
});
