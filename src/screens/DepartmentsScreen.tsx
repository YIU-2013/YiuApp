import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
  Animated,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import TouchableScale from '../components/TouchableScale';
import ScreenHeader from '../components/ScreenHeader';
import { useDepartments, useRefreshDepartments } from '../hooks/useDepartments';
import { DepartmentStackParamList } from '../navigation/types';
import { Faculty } from '../types/models';
import { colors, spacing, typography, shadows } from '../theme';
import { hp, rs } from '../utils/responsive';

// ─── Nav Types ───────────────────────────────────────────────────────────────
type NavigationProp = NativeStackNavigationProp<DepartmentStackParamList, 'DepartmentsMain'>;

// ─── Filter Types ────────────────────────────────────────────────────────────
type FilterType = 'ALL' | 'FACULTY' | 'SCHOOL';

interface CategoryTab {
  label: string;
  value: FilterType;
}

const CATEGORIES: CategoryTab[] = [
  { label: 'Tümü', value: 'ALL' },
  { label: 'Fakülteler', value: 'FACULTY' },
  { label: 'Meslek Yüksekokulu', value: 'SCHOOL' },
];

// Local Header component removed - using shared ScreenHeader

// ─── Faculty Card Component ──────────────────────────────────────────────────
interface FacultyCardProps {
  faculty: Faculty;
  searchQuery: string;
  onPress: () => void;
}

const FacultyCard = React.memo(function FacultyCard({ faculty, searchQuery, onPress }: FacultyCardProps) {
  // Arama kelimesiyle eşleşen bölümler
  const matchedDepts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return faculty.departments.filter(
      (d) => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)
    );
  }, [faculty.departments, searchQuery]);

  const totalPrograms = faculty.departments.length;
  const isSchool = faculty.code === 'SHMYO';

  return (
    <TouchableScale onPress={onPress} style={styles.facultyCardTouchable}>
      <Card shadow="sm" style={styles.facultyCard} padding={spacing.sm}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={faculty.icon as any} size={rs(26)} color={colors.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.facultyName} numberOfLines={1}>
              {faculty.name}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.codeBadge, isSchool ? styles.schoolBadge : styles.facultyBadge]}>
                <Text style={[styles.codeBadgeText, isSchool ? styles.schoolBadgeText : styles.facultyBadgeText]}>
                  {faculty.code}
                </Text>
              </View>
              <Text style={styles.programCountText}>
                {totalPrograms} Program
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={rs(20)} color={colors.textMuted} style={styles.chevron} />
        </View>

        {/* Card Description */}
        <Text style={styles.facultyDesc} numberOfLines={2}>
          {faculty.description}
        </Text>

        {/* Searched Department Matches */}
        {matchedDepts.length > 0 && (
          <View style={styles.matchContainer}>
            <Text style={styles.matchTitle}>Eşleşen Bölümler ({matchedDepts.length}):</Text>
            {matchedDepts.slice(0, 2).map((dept) => (
              <View key={dept.id} style={styles.matchRow}>
                <Ionicons name="checkmark-circle-outline" size={rs(14)} color={colors.success} />
                <Text style={styles.matchText} numberOfLines={1}>
                  {dept.name} ({dept.language}) - {dept.duration} Yıl
                </Text>
              </View>
            ))}
            {matchedDepts.length > 2 && (
              <Text style={styles.moreMatchText}>+{matchedDepts.length - 2} bölüm daha eşleşti</Text>
            )}
          </View>
        )}

        {/* Footer Details */}
        <View style={styles.cardFooter}>
          <View style={styles.deanInfo}>
            <Text style={styles.deanTitle}>{isSchool ? 'Yüksekokul Md.' : 'Fakülte Dekanı'}</Text>
            <Text style={styles.deanName}>{faculty.dean}</Text>
          </View>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Programları İncele</Text>
            <Ionicons name="arrow-forward" size={rs(14)} color={colors.primary} />
          </View>
        </View>
      </Card>
    </TouchableScale>
  );
});

// ─── Skeleton Loader Component ────────────────────────────────────────────────
function SkeletonList() {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <Skeleton width={rs(48)} height={rs(48)} borderRadius={rs(12)} />
            <View style={styles.skeletonTitles}>
              <Skeleton width="60%" height={rs(16)} borderRadius={rs(4)} />
              <Skeleton width="30%" height={rs(12)} borderRadius={rs(4)} style={{ marginTop: rs(6) }} />
            </View>
          </View>
          <Skeleton width="100%" height={rs(14)} borderRadius={rs(4)} style={{ marginTop: rs(14) }} />
          <Skeleton width="90%" height={rs(14)} borderRadius={rs(4)} style={{ marginTop: rs(6) }} />
          <Skeleton width="40%" height={rs(14)} borderRadius={rs(4)} style={{ marginTop: rs(6) }} />
          <View style={styles.skeletonFooter}>
            <Skeleton width="45%" height={rs(12)} borderRadius={rs(4)} />
            <Skeleton width="30%" height={rs(14)} borderRadius={rs(4)} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DepartmentsScreen() {
  const nav = useNavigation<NavigationProp>();
  const refresh = useRefreshDepartments();
  const { data: faculties, isLoading, isRefetching } = useDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [isFocused, setIsFocused] = useState(false);

  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const animatedBorderColor = useMemo(() => {
    return focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    });
  }, [focusAnim]);

  const animatedBgColor = useMemo(() => {
    return focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.background, colors.surface],
    });
  }, [focusAnim]);

  // ── Pull-to-refresh
  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // ── Filter & Search Logic
  const filteredData = useMemo(() => {
    if (!faculties) return [];

    return faculties.filter((faculty) => {
      // 1. Kategori Filtresi
      const matchesCategory =
        activeFilter === 'ALL' ||
        (activeFilter === 'FACULTY' && faculty.code !== 'SHMYO') ||
        (activeFilter === 'SCHOOL' && faculty.code === 'SHMYO');

      if (!matchesCategory) return false;

      // 2. Arama Filtresi
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();

      const facultyMatch =
        faculty.name.toLowerCase().includes(query) ||
        faculty.code.toLowerCase().includes(query) ||
        faculty.description.toLowerCase().includes(query);

      const departmentMatch = faculty.departments.some(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.description.toLowerCase().includes(query)
      );

      return facultyMatch || departmentMatch;
    });
  }, [faculties, activeFilter, searchQuery]);

  // ── List Empty State
  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={rs(52)} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Sonuç Bulunamadı</Text>
        <Text style={styles.emptySubtitle}>
          "{searchQuery}" aramasıyla eşleşen bir fakülte veya akademik program bulunamadı. Lütfen yazımı kontrol edin.
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper backgroundColor={colors.headerBg} style={styles.container}>
      <ScreenHeader
        rightElement={
          <View style={styles.headerRight}>
            <Ionicons name="school" size={rs(22)} color={colors.primary} />
          </View>
        }
      />

      {/* Search & Filter Section (Sticky Background) */}
      <View style={styles.topControlContainer}>
        {/* Search Bar */}
        <Animated.View style={[
          styles.searchBar,
          isFocused ? shadows.md : shadows.sm,
          {
            borderColor: animatedBorderColor,
            backgroundColor: animatedBgColor,
          }
        ]}>
          <Ionicons name="search-outline" size={rs(18)} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Fakülte veya bölüm ara..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="never"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={rs(18)} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Filter Tab Chips */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {CATEGORIES.map((tab) => {
              const active = activeFilter === tab.value;
              return (
                <TouchableScale
                  key={tab.value}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveFilter(tab.value)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableScale>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Faculty List */}
      {isLoading && !isRefetching ? (
        <SkeletonList />
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            data={filteredData}
            renderItem={({ item }) => (
              <FacultyCard
                faculty={item}
                searchQuery={searchQuery}
                onPress={() => nav.navigate('DepartmentDetail', { faculty: item })}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },

  headerRight: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(19),
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search & Filter Top Container
  topControlContainer: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs, // Reduced vertical padding
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: rs(42),
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    paddingVertical: 0,
  },

  // Filters
  filterWrapper: { marginTop: spacing.md },
  filterScroll: { gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: rs(8),
    borderRadius: rs(20),
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },

  // Faculty Card Styles
  facultyCardTouchable: {
    marginBottom: spacing.md,
    borderRadius: rs(16),
  },
  facultyCard: {
    borderRadius: rs(16),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: rs(42),
    height: rs(42),
    borderRadius: rs(11),
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  facultyName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rs(4),
    gap: spacing.sm,
  },
  codeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(2),
    borderRadius: rs(4),
  },
  facultyBadge: { backgroundColor: colors.badgeBlueBg },
  schoolBadge: { backgroundColor: colors.badgeRedBg },
  codeBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
  },
  facultyBadgeText: { color: colors.badgeBlueText },
  schoolBadgeText: { color: colors.badgeRedText },
  programCountText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  chevron: { alignSelf: 'center' },
  facultyDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    marginTop: spacing.sm, // Reduced padding
  },

  // Match Area
  matchContainer: {
    backgroundColor: 'rgba(22, 163, 74, 0.08)', // %8 opacity
    borderLeftWidth: rs(3),
    borderLeftColor: colors.success,
    borderRadius: rs(6),
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  matchTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#166534',
    marginBottom: rs(4),
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: rs(2),
  },
  matchText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  moreMatchText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    marginTop: rs(4),
    marginLeft: spacing.xs + rs(14),
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    marginTop: spacing.sm, // Reduced from md
    paddingTop: spacing.sm, // Reduced from md
  },
  deanInfo: {
    flex: 1,
  },
  deanTitle: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.caps,
  },
  deanName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: rs(2),
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ctaText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },

  // Skeletons
  skeletonContainer: {
    flex: 1,
    padding: spacing.base,
    backgroundColor: colors.background,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: rs(16),
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center' },
  skeletonTitles: { flex: 1, marginLeft: spacing.md },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: hp(15),
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
});
