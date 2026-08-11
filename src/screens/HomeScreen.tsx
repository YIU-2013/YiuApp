import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQueryClient } from '@tanstack/react-query';

import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import TouchableScale from '../components/TouchableScale';
import ScreenHeader from '../components/ScreenHeader';
import CampusLifeCard from '../components/CampusLifeCard';
import CampusQuickActions, { QuickActionItem } from '../components/CampusQuickActions';
import FeaturedSlider, { FeaturedSlide } from '../components/FeaturedSlider';
import {
  SkeletonAnnouncementCard,
  SkeletonEventCard,
} from '../components/Skeleton';

import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useEvents } from '../hooks/useEvents';
import { useOpportunities } from '../hooks/useOpportunities';
import { ANNOUNCEMENTS_KEY } from '../hooks/useAnnouncements';
import { EVENTS_KEY } from '../hooks/useEvents';
import { Announcement, Event } from '../types/models';
import { HomeStackParamList, RootTabParamList } from '../navigation/types';

// FeaturedSlider'ın "Kampüs" slide'ı için gerçek kampüs fotoğrafı — proje
// assets'inde zaten mevcut (Tıp Fakültesi binası havadan görünüm).
const CAMPUS_IMAGE = require('../../assets/images/campus.png');

// ─── Types ────────────────────────────────────────────────────────────────────
// Home tabından hem kendi stack'i (detay ekranları) hem de diğer sekmelere
// (Kampüsüm, Fırsatlar, İletişim...) type-safe geçiş yapabilmek için composite
// navigation prop kullanılıyor.
type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<RootTabParamList>
>;

type HomeItem =
  | { _t: 'FEATURED' }
  | { _t: 'QUICK' }
  | { _t: 'CAMPUS_LIFE' }
  | { _t: 'ANNO_HEADER' }
  | { _t: 'ANNO'; item: Announcement }
  | { _t: 'ANNO_SKELETON' }
  | { _t: 'EVENT_HEADER' }
  | { _t: 'EVENT'; item: Event }
  | { _t: 'EVENT_SKELETON' }
  | { _t: 'FOOTER' };

// ─── Announcement Card ────────────────────────────────────────────────────────
interface AnnoCardProps { item: Announcement; onPress: () => void }
const AnnoCard = React.memo(function AnnoCard({ item, onPress }: AnnoCardProps) {
  const isAk = item.type === 'AKADEMİK';
  const badgeBg   = isAk ? colors.badgeBlueBg  : colors.badgeRedBg;
  const badgeText = isAk ? colors.badgeBlueText : colors.badgeRedText;
  return (
    <TouchableScale onPress={onPress} style={s.cardTouchable}>
      <Card shadow="sm" style={s.annoCard}>
        <View style={s.annoMeta}>
          <View style={[s.badge, { backgroundColor: badgeBg }]}>
            <Text style={[s.badgeText, { color: badgeText }]}>{item.type}</Text>
          </View>
          <Text style={s.annoDate}>{item.date}</Text>
        </View>
        <Text style={s.annoTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={s.annoDesc} numberOfLines={2}>{item.excerpt}</Text>
        <View style={s.annoCta}>
          <Text style={s.annoLink}>Detayları İncele</Text>
          <Ionicons name="arrow-forward" size={rs(13)} color={colors.primary} />
        </View>
      </Card>
    </TouchableScale>
  );
});

// ─── Event Card ───────────────────────────────────────────────────────────────
interface EventCardProps { item: Event; onPress: () => void }
const EventCard = React.memo(function EventCard({ item, onPress }: EventCardProps) {
  return (
    <TouchableScale onPress={onPress} style={s.cardTouchable}>
      <Card shadow="sm" style={s.eventCard} padding={spacing.base}>
        <View style={s.eventDateBox}>
          <Text style={s.eventDay}>{item.day}</Text>
          <Text style={s.eventMonth}>{item.month}</Text>
        </View>
        <View style={s.eventInfo}>
          <Text style={s.eventTitle} numberOfLines={1}>{item.title}</Text>
          <View style={s.eventMetaRow}>
            <Ionicons name="time-outline" size={rs(12)} color={colors.textSecondary} />
            <Text style={s.eventMetaText}>{item.time}</Text>
            <View style={s.metaDot} />
            <Ionicons name="location-outline" size={rs(12)} color={colors.textSecondary} />
            <Text style={s.eventMetaText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </Card>
    </TouchableScale>
  );
});

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; onSeeAll?: () => void }
const SectionHeader = React.memo(function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableScale onPress={onSeeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.seeAll}>TÜMÜNÜ GÖR</Text>
        </TouchableScale>
      )}
    </View>
  );
});

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const qc  = useQueryClient();
  const listRef = useRef<FlashListRef<HomeItem>>(null);

  const { data: announcements, isLoading: annoLoading } = useAnnouncements();
  const { data: events,        isLoading: eventLoading } = useEvents();
  const { data: opportunities } = useOpportunities();

  // ── Pull-to-refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY }),
      qc.invalidateQueries({ queryKey: EVENTS_KEY }),
    ]);
    setRefreshing(false);
  }, [qc]);

  // ── Öne çıkanlar slider'ı: gerçek en güncel duyuru/etkinlik/fırsat +
  // her zaman mevcut olan statik "Kampüs" çağrısı (boş veri durumunda
  // slider'ın tamamen boş kalmaması için)
  const featuredSlides = useMemo<FeaturedSlide[]>(() => {
    const list: FeaturedSlide[] = [];

    const topAnno = announcements?.[0];
    if (topAnno) {
      list.push({
        id: `anno-${topAnno.id}`,
        title: topAnno.title,
        type: 'announcement',
        onPress: () => nav.navigate('AnnouncementDetail', { announcement: topAnno }),
      });
    }

    const topEvent = events?.[0];
    if (topEvent) {
      list.push({
        id: `event-${topEvent.id}`,
        title: topEvent.title,
        type: 'event',
        onPress: () => nav.navigate('EventDetail', { event: topEvent }),
      });
    }

    const topOpportunity = opportunities?.[0];
    if (topOpportunity) {
      list.push({
        id: `opp-${topOpportunity.id}`,
        title: topOpportunity.title,
        type: 'opportunity',
        onPress: () => nav.navigate('Opportunities'),
      });
    }

    list.push({
      id: 'campus-highlight',
      title: 'Kampüs Hayatını Keşfet',
      type: 'campus',
      image: CAMPUS_IMAGE,
      onPress: () => nav.navigate('Campus'),
    });

    return list;
  }, [announcements, events, opportunities, nav]);

  // ── FlashList veri dizisi (tüm ekran tek liste olarak)
  const items = useMemo<HomeItem[]>(() => {
    const list: HomeItem[] = [
      { _t: 'FEATURED' },
      { _t: 'QUICK' },
      { _t: 'CAMPUS_LIFE' },
      { _t: 'ANNO_HEADER' },
    ];

    if (annoLoading) {
      list.push({ _t: 'ANNO_SKELETON' }, { _t: 'ANNO_SKELETON' });
    } else {
      (announcements ?? []).slice(0, 4).forEach(item =>
        list.push({ _t: 'ANNO', item })
      );
    }

    list.push({ _t: 'EVENT_HEADER' });

    if (eventLoading) {
      list.push({ _t: 'EVENT_SKELETON' }, { _t: 'EVENT_SKELETON' });
    } else {
      (events ?? []).slice(0, 4).forEach(item =>
        list.push({ _t: 'EVENT', item })
      );
    }

    list.push({ _t: 'FOOTER' });
    return list;
  }, [announcements, events, annoLoading, eventLoading]);

  // ── "Duyurular"/"Etkinlikler" hızlı erişim kartları, aynı ekranda ilgili
  // section header'a kaydırır (sahte/boş buton bırakmamak için)
  const annoHeaderIndex  = useMemo(() => items.findIndex(i => i._t === 'ANNO_HEADER'), [items]);
  const eventHeaderIndex = useMemo(() => items.findIndex(i => i._t === 'EVENT_HEADER'), [items]);

  const scrollToAnnouncements = useCallback(() => {
    if (annoHeaderIndex >= 0) listRef.current?.scrollToIndex({ index: annoHeaderIndex, animated: true });
  }, [annoHeaderIndex]);

  const scrollToEvents = useCallback(() => {
    if (eventHeaderIndex >= 0) listRef.current?.scrollToIndex({ index: eventHeaderIndex, animated: true });
  }, [eventHeaderIndex]);

  // ── Kampüs hızlı erişim aksiyonları (diğer sekmelere / ilgili section'a gider)
  const quickActionItems = useMemo<QuickActionItem[]>(() => [
    { label: 'Duyurular',        description: 'Güncel bilgilendirmeler', icon: 'bullhorn-outline',       onPress: scrollToAnnouncements },
    { label: 'Etkinlikler',      description: 'Kampüste bu hafta',       icon: 'calendar-check-outline', onPress: scrollToEvents },
    { label: 'Akademik Takvim',  description: 'Önemli tarihler',         icon: 'calendar-month-outline', onPress: () => nav.navigate('Campus') },
    { label: 'Fırsatlar',        description: 'Öğrenci avantajları',     icon: 'tag-outline',            onPress: () => nav.navigate('Opportunities') },
    { label: 'İletişim',         description: 'Bize ulaşın',             icon: 'phone-outline',          onPress: () => nav.navigate('Contact') },
    { label: 'Kampüs Haritası',  description: 'Yerleşkeyi keşfet',       icon: 'map-marker-outline',     onPress: () => nav.navigate('Campus') },
  ], [nav, scrollToAnnouncements, scrollToEvents]);

  // ── FlashList renderItem
  const renderItem = useCallback(
    ({ item }: { item: HomeItem }) => {
      switch (item._t) {
        case 'FEATURED':    return <FeaturedSlider slides={featuredSlides} />;
        case 'CAMPUS_LIFE': return <CampusLifeCard onPress={() => nav.navigate('Campus')} />;
        case 'QUICK':       return <CampusQuickActions title="Hızlı Erişim" items={quickActionItems} />;
        case 'ANNO_HEADER': return (
          <SectionHeader title="Son Duyurular" onSeeAll={() => {}} />
        );
        case 'ANNO': return (
          <AnnoCard
            item={item.item}
            onPress={() => nav.navigate('AnnouncementDetail', { announcement: item.item })}
          />
        );
        case 'ANNO_SKELETON': return <SkeletonAnnouncementCard />;
        case 'EVENT_HEADER': return (
          <View style={s.eventSectionGap}>
            <SectionHeader title="Yaklaşan Etkinlikler" />
          </View>
        );
        case 'EVENT': return (
          <EventCard
            item={item.item}
            onPress={() => nav.navigate('EventDetail', { event: item.item })}
          />
        );
        case 'EVENT_SKELETON': return <SkeletonEventCard />;
        case 'FOOTER': return <View style={s.footer} />;
        default: return null;
      }
    },
    [nav, quickActionItems, featuredSlides]
  );

  // ── FlashList keyExtractor
  const keyExtractor = useCallback((item: HomeItem, index: number): string => {
    if (item._t === 'ANNO')  return `anno-${item.item.id}`;
    if (item._t === 'EVENT') return `event-${item.item.id}`;
    return `${item._t}-${index}`;
  }, []);

  return (
    <ScreenWrapper backgroundColor={colors.headerBg}>
      <ScreenHeader
        rightElement={
          <TouchableScale
            style={s.notifBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Bildirimler"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={rs(22)} color={colors.primary} />
          </TouchableScale>
        }
      />
      <FlashList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        bounces
        overScrollMode="never"
        scrollIndicatorInsets={{ right: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  footer: { height: spacing.xxl },

  notifBtn: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(19),
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section headers
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  seeAll: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.caps,
  },
  eventSectionGap: { marginTop: spacing.sm },

  // Announcement cards
  cardTouchable: { marginBottom: spacing.md, borderRadius: rs(16) },
  annoCard: { borderRadius: rs(16) }, // Removed marginBottom since TouchableScale handles spacing
  annoMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  badge: { borderRadius: rs(6), paddingHorizontal: spacing.sm, paddingVertical: rs(3) },
  badgeText: { fontSize: typography.sizes.xxs, fontWeight: typography.weights.semibold, letterSpacing: typography.letterSpacing.wide },
  annoDate: { fontSize: typography.sizes.sm, color: colors.textMuted, fontWeight: typography.weights.medium },
  annoTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    lineHeight: typography.sizes.base * typography.lineHeights.snug,
    marginBottom: spacing.xs,
  },
  annoDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    marginBottom: spacing.md,
  },
  annoCta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: spacing.xs },
  annoLink: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.primary },

  // Event cards
  eventCard: { flexDirection: 'row', alignItems: 'center', borderRadius: rs(16) }, // Removed marginBottom
  eventDateBox: {
    width: rs(42),
    height: rs(46),
    borderRadius: rs(10),
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  eventDay: { color: colors.textInverse, fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, lineHeight: typography.sizes.lg },
  eventMonth: { color: 'rgba(255,255,255,0.85)', fontSize: typography.sizes.xxs, fontWeight: typography.weights.semibold, letterSpacing: typography.letterSpacing.wider, marginTop: rs(2) },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontSize: typography.sizes.base, fontWeight: typography.weights.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center', gap: rs(4), flexWrap: 'nowrap' },
  metaDot: { width: rs(3), height: rs(3), borderRadius: rs(1.5), backgroundColor: colors.textMuted, marginHorizontal: rs(2) },
  eventMetaText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium, flexShrink: 1 },
});
