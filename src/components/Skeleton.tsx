import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { rs } from '../utils/responsive';

// ─── Primitive Skeleton ───────────────────────────────────────────────────────
interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = rs(16),
  borderRadius = rs(8),
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={[
        s.base,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// ─── Duyuru Kart Skeleton ─────────────────────────────────────────────────────
export function SkeletonAnnouncementCard() {
  return (
    <View style={s.card}>
      <View style={s.row}>
        <Skeleton width={rs(80)} height={rs(22)} borderRadius={rs(6)} />
        <Skeleton width={rs(64)} height={rs(14)} />
      </View>
      <Skeleton height={rs(18)} style={s.mt10} />
      <Skeleton width="72%" height={rs(18)} style={s.mt4} />
      <Skeleton height={rs(13)} style={s.mt10} />
      <Skeleton width="88%" height={rs(13)} style={s.mt4} />
      <Skeleton width="62%" height={rs(13)} style={s.mt4} />
      <View style={s.rowEnd}>
        <Skeleton width={rs(110)} height={rs(13)} style={s.mt10} />
      </View>
    </View>
  );
}

// ─── Etkinlik Kart Skeleton ───────────────────────────────────────────────────
export function SkeletonEventCard() {
  return (
    <View style={s.eventCard}>
      <Skeleton width={rs(50)} height={rs(56)} borderRadius={rs(12)} />
      <View style={s.eventInfo}>
        <Skeleton height={rs(16)} borderRadius={rs(6)} />
        <Skeleton width="55%" height={rs(13)} borderRadius={rs(6)} style={s.mt8} />
      </View>
    </View>
  );
}

// ─── Section Header Skeleton ──────────────────────────────────────────────────
export function SkeletonSectionHeader() {
  return <Skeleton width={rs(140)} height={rs(20)} borderRadius={rs(8)} style={s.mb12} />;
}

const s = StyleSheet.create({
  base: { backgroundColor: '#E5E7EB' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    padding: rs(16),
    marginBottom: rs(12),
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    padding: rs(16),
    marginBottom: rs(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(14),
  },
  eventInfo: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
  mt4: { marginTop: rs(4) },
  mt8: { marginTop: rs(8) },
  mt10: { marginTop: rs(10) },
  mb12: { marginBottom: rs(12) },
});
