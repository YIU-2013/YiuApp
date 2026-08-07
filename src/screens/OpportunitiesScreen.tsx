import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import TouchableScale from '../components/TouchableScale';
import { Skeleton } from '../components/Skeleton';
import { useOpportunities, useRefreshOpportunities } from '../hooks/useOpportunities';
import { Opportunity, OpportunityCategory } from '../types/models';
import { colors, spacing, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';

// ─── Kategori → rozet renk eşlemesi ──────────────────────────────────────────
const CATEGORY_STYLE: Record<OpportunityCategory, { bg: string; text: string }> = {
  'İndirim':          { bg: colors.badgeRedBg,    text: colors.badgeRedText },
  'Kampüs Fırsatı':   { bg: colors.badgeBlueBg,   text: colors.badgeBlueText },
  'Anlaşmalı Kurum':  { bg: colors.badgeGreenBg,  text: colors.badgeGreenText },
  'Sosyal İmkan':     { bg: colors.badgeYellowBg, text: colors.badgeYellowText },
};

// ─── Fırsat Kartı ─────────────────────────────────────────────────────────────
const OpportunityCard = React.memo(function OpportunityCard({ item }: { item: Opportunity }) {
  const badge = CATEGORY_STYLE[item.category];

  const handlePress = useCallback(() => {
    if (!item.actionUrl) return;
    Linking.openURL(item.actionUrl).catch(() => {
      Alert.alert('Hata', 'Bağlantı açılamadı.');
    });
  }, [item.actionUrl]);

  return (
    <TouchableScale
      style={s.cardTouchable}
      onPress={item.actionUrl ? handlePress : undefined}
      disabled={!item.actionUrl}
    >
      <Card shadow="sm" style={s.card}>
        <View style={s.cardHeader}>
          <View style={s.iconWrap}>
            <Ionicons name={item.icon as any} size={rs(22)} color={colors.primary} />
          </View>
          <View style={s.titleWrap}>
            <View style={[s.badge, { backgroundColor: badge.bg }]}>
              <Text style={[s.badgeText, { color: badge.text }]}>{item.category}</Text>
            </View>
            <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          </View>
        </View>
        <Text style={s.desc} numberOfLines={3}>{item.description}</Text>
        {item.actionUrl && (
          <View style={s.cta}>
            <Text style={s.ctaText}>{item.actionLabel ?? 'İncele'}</Text>
            <Ionicons name="arrow-forward" size={rs(13)} color={colors.primary} />
          </View>
        )}
      </Card>
    </TouchableScale>
  );
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <View style={s.skeletonContainer}>
      {[1, 2, 3, 4].map(key => (
        <View key={key} style={s.skeletonCard}>
          <View style={s.skeletonRow}>
            <Skeleton width={rs(44)} height={rs(44)} borderRadius={rs(12)} />
            <View style={s.skeletonTitles}>
              <Skeleton width="40%" height={rs(12)} borderRadius={rs(4)} />
              <Skeleton width="80%" height={rs(16)} borderRadius={rs(4)} style={s.mt6} />
            </View>
          </View>
          <Skeleton width="100%" height={rs(13)} borderRadius={rs(4)} style={s.mt12} />
          <Skeleton width="70%" height={rs(13)} borderRadius={rs(4)} style={s.mt6} />
        </View>
      ))}
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OpportunitiesScreen() {
  const { data, isLoading, isRefetching } = useOpportunities();
  const refresh = useRefreshOpportunities();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <ScreenWrapper backgroundColor={colors.headerBg}>
      <ScreenHeader />
      <View style={s.introWrap}>
        <Text style={s.introTitle}>YİÜ Ayrıcalıkları</Text>
        <Text style={s.introSubtitle}>Yüksek İhtisaslı olmanın sana sağladığı fırsatlar</Text>
      </View>

      {isLoading && !isRefetching ? (
        <SkeletonList />
      ) : (
        <FlashList
          data={data ?? []}
          renderItem={({ item }) => <OpportunityCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || (isRefetching && !isLoading)}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  introWrap: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.headerBg,
  },
  introTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  introSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: rs(2),
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },

  cardTouchable: { marginBottom: spacing.md, borderRadius: rs(16) },
  card: { borderRadius: rs(16) },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(12),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleWrap: { flex: 1 },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: rs(6),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(2),
    marginBottom: rs(4),
  },
  badgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: typography.sizes.base * typography.lineHeights.snug,
  },
  desc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    marginTop: spacing.sm,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  ctaText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.primary },

  // Skeleton
  skeletonContainer: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: rs(16),
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  skeletonRow: { flexDirection: 'row', alignItems: 'center' },
  skeletonTitles: { flex: 1, marginLeft: spacing.md },
  mt6: { marginTop: rs(6) },
  mt12: { marginTop: rs(12) },
});
