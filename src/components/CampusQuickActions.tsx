import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';
import TouchableScale from './TouchableScale';
import { colors, spacing, typography } from '../theme';
import { rs, useResponsive } from '../utils/responsive';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface QuickActionItem {
  label: string;
  icon: IconName;
  onPress: () => void;
}

interface CampusQuickActionsProps {
  /** Bölüm başlığı — verilmezse başlık gösterilmez */
  title?: string;
  /** Grid'de gösterilecek aksiyonlar (her çağıran kendi navigasyonunu bağlar) */
  items: QuickActionItem[];
}

/**
 * Reusable kampüs hızlı erişim grid'i.
 * HomeScreen'de "Hızlı Erişim", CampusScreen'de "Sık Kullanılan Bağlantılar"
 * bölümlerinde farklı `items` ile kullanılır.
 *
 * Sütun sayısı ekran genişliğine göre reaktif belirlenir (telefonda 2,
 * tablet genişliğinde >=768pt 4) — iPad Split View / web resize gibi
 * durumlarda da doğru kalır (bkz. utils/responsive.ts useResponsive()).
 */
export default function CampusQuickActions({ title, items }: CampusQuickActionsProps) {
  const { width, isTablet } = useResponsive();
  const columns = isTablet ? 4 : 2;
  const cardW = (width - spacing.base * 2 - spacing.sm * (columns - 1)) / columns;

  return (
    <View style={s.section}>
      {title && <Text style={s.sectionTitle}>{title}</Text>}
      <View style={s.grid}>
        {items.map((item, i) => (
          <TouchableScale key={i} style={[s.card, { width: cardW }]} onPress={item.onPress}>
            <Card shadow="sm" style={s.cardInner} padding={spacing.sm}>
              <View style={s.iconWrap}>
                <MaterialCommunityIcons name={item.icon} size={rs(22)} color={colors.primary} />
              </View>
              <Text style={s.label} numberOfLines={1}>{item.label}</Text>
            </Card>
          </TouchableScale>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { height: rs(112), borderRadius: rs(16) },
  cardInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: rs(16) },
  iconWrap: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(12),
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
