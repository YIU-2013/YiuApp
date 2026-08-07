import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenWrapper from '../components/ScreenWrapper';
import { HomeStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

type Props = NativeStackScreenProps<HomeStackParamList, 'AnnouncementDetail'>;

export default function AnnouncementDetailScreen({ route }: Props) {
  const { announcement: a } = route.params;
  const isAk = a.type === 'AKADEMİK';
  const badgeBg   = isAk ? colors.badgeBlueBg  : colors.badgeRedBg;
  const badgeText = isAk ? colors.badgeBlueText : colors.badgeRedText;

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="never"
      >
        {/* Badge + Tarih */}
        <View style={s.meta}>
          <View style={[s.badge, { backgroundColor: badgeBg }]}>
            <Text style={[s.badgeText, { color: badgeText }]}>{a.type}</Text>
          </View>
          <Text style={s.date}>{a.date}</Text>
        </View>

        {/* Başlık */}
        <Text style={s.title}>{a.title}</Text>

        {/* Etiketler */}
        {a.tags && a.tags.length > 0 && (
          <View style={s.tagsRow}>
            {a.tags.map(tag => (
              <View key={tag} style={s.tag}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ayraç */}
        <View style={s.divider} />

        {/* İçerik */}
        <Text style={s.body}>{a.content}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  badge: {
    borderRadius: rs(6),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  date: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: typography.sizes.xl * typography.lineHeights.snug,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.iconBg,
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
  },
  tagText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.base,
  },
  body: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
});
