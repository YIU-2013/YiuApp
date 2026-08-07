import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';

interface StudentIdentityCardProps {
  /**
   * Aşağıdaki alanların tamamı opsiyonel — ilk sürümde login/auth
   * olmadan statik çalışır. Gelecekte auth bağlandığında öğrenciye
   * özel verilerle beslenmeye hazırdır.
   */
  studentName?: string;
  department?: string;
  studentNumber?: string;
}

/**
 * "Ben Yüksek İhtisaslıyım" aidiyet kartı.
 *
 * Öğrencinin üniversiteye dijital kimlik/aidiyet hissini pekiştiren,
 * Ana Sayfa'da (ve gelecekte Kampüsüm ekranında) kullanılan reusable
 * kart. Yeni bağımlılık (gradient lib vb.) kullanmadan, VideoCard'daki
 * gibi yarı saydam dekoratif katmanlarla premium bir görünüm hedefler.
 */
export default function StudentIdentityCard({
  studentName,
  department,
  studentNumber,
}: StudentIdentityCardProps) {
  const hasPersonalInfo = !!(studentName || department || studentNumber);

  return (
    <View style={[s.card, shadows.brand]}>
      {/* Dekoratif katmanlar */}
      <View style={s.circleLg} />
      <View style={s.circleSm} />

      <View style={s.badgeRow}>
        <View style={s.badge}>
          <Ionicons name="shield-checkmark" size={rs(13)} color={colors.textInverse} />
          <Text style={s.badgeText}>YİÜ KİMLİĞİ</Text>
        </View>
      </View>

      {studentName && <Text style={s.greeting}>Merhaba, {studentName} 👋</Text>}

      <Text style={s.headline}>Ben Yüksek İhtisaslıyım</Text>
      <Text style={s.motto}>Yüksek İhtisaslı olmak bir ayrıcalıktır.</Text>

      {hasPersonalInfo && (department || studentNumber) && (
        <View style={s.infoRow}>
          {department && <Text style={s.infoText}>{department}</Text>}
          {department && studentNumber && <View style={s.infoDot} />}
          {studentNumber && <Text style={s.infoText}>{studentNumber}</Text>}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: rs(20),
    padding: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  circleLg: {
    position: 'absolute',
    top: -rs(60),
    right: -rs(40),
    width: rs(160),
    height: rs(160),
    borderRadius: rs(80),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleSm: {
    position: 'absolute',
    bottom: -rs(30),
    right: rs(40),
    width: rs(70),
    height: rs(70),
    borderRadius: rs(35),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeRow: { flexDirection: 'row', marginBottom: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(4),
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: rs(100),
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(4),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.caps,
  },
  greeting: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xxs,
  },
  headline: {
    color: colors.textInverse,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: typography.sizes.xl * typography.lineHeights.snug,
  },
  motto: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xxs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  infoText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  infoDot: {
    width: rs(3),
    height: rs(3),
    borderRadius: rs(1.5),
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.xs,
  },
});
