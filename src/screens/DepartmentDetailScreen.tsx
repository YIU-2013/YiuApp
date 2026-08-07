import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import TouchableScale from '../components/TouchableScale';
import { DepartmentStackParamList } from '../navigation/types';
import { colors, spacing, typography, shadows } from '../theme';
import { rs } from '../utils/responsive';
import { Department } from '../types/models';

type Props = NativeStackScreenProps<DepartmentStackParamList, 'DepartmentDetail'>;

// ─── Department Accordion Card Component ─────────────────────────────────────
interface DeptCardProps {
  dept: Department;
}

const DeptCard = React.memo(function DeptCard({ dept }: DeptCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card shadow="sm" style={styles.deptCard} padding={0}>
      <TouchableScale
        onPress={toggleExpanded}
        style={styles.deptHeader}
      >
        <View style={styles.deptTitleWrap}>
          <Text style={styles.deptName}>{dept.name}</Text>
          <View style={styles.deptBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{dept.duration} Yıl</Text>
            </View>
            <View style={[styles.badge, styles.langBadge]}>
              <Text style={[styles.badgeText, styles.langBadgeText]}>{dept.language}</Text>
            </View>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={rs(20)}
          color={colors.primary}
        />
      </TouchableScale>

      {expanded && (
        <View style={styles.deptContent}>
          <Text style={styles.deptDesc}>{dept.description}</Text>

          {dept.careerOpportunities && dept.careerOpportunities.length > 0 && (
            <View style={styles.careerSection}>
              <Text style={styles.careerTitle}>Kariyer Olanakları</Text>
              {dept.careerOpportunities.map((opp, idx) => (
                <View key={idx} style={styles.careerRow}>
                  <Ionicons name="radio-button-on" size={rs(6)} color={colors.accent} style={styles.careerDot} />
                  <Text style={styles.careerText}>{opp}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DepartmentDetailScreen({ route }: Props) {
  const { faculty } = route.params;
  const isSchool = faculty.code === 'SHMYO';

  // ── Contact Handlers
  const handleCall = () => {
    const cleanPhone = faculty.contactPhone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Hata', 'Arama gerçekleştirilemedi.');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${faculty.contactEmail}`).catch(() => {
      Alert.alert('Hata', 'E-posta istemcisi açılamadı.');
    });
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Faculty Brand Card */}
        <Card shadow="sm" style={styles.brandCard}>
          <View style={styles.facultyIconContainer}>
            <Ionicons name={faculty.icon as any} size={rs(38)} color={colors.primary} />
          </View>
          <Text style={styles.facultyName}>{faculty.name}</Text>
          <Text style={styles.facultyCode}>({faculty.code})</Text>
          <Text style={styles.facultyDesc}>{faculty.description}</Text>
        </Card>

        {/* Dean and Contact Info */}
        <Card shadow="sm" style={styles.infoCard}>
          <Text style={styles.sectionTitle}>{isSchool ? 'Yönetim' : 'Dekanlık'}</Text>
          <View style={styles.deanRow}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={rs(24)} color={colors.primary} />
            </View>
            <View style={styles.deanTextWrap}>
              <Text style={styles.deanName}>{faculty.dean}</Text>
              <Text style={styles.deanRole}>{isSchool ? 'Yüksekokul Müdürü' : 'Fakülte Dekanı'}</Text>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.contactContainer}>
            <TouchableScale style={styles.contactRow} onPress={handleCall}>
              <View style={styles.contactIconWrap}>
                <Ionicons name="call" size={rs(16)} color={colors.primary} />
              </View>
              <View style={styles.contactTextWrap}>
                <Text style={styles.contactLabel}>Telefon</Text>
                <Text style={styles.contactValue}>{faculty.contactPhone}</Text>
              </View>
            </TouchableScale>

            <TouchableScale style={styles.contactRow} onPress={handleEmail}>
              <View style={styles.contactIconWrap}>
                <Ionicons name="mail" size={rs(16)} color={colors.primary} />
              </View>
              <View style={styles.contactTextWrap}>
                <Text style={styles.contactLabel}>E-Posta</Text>
                <Text style={styles.contactValue}>{faculty.contactEmail}</Text>
              </View>
            </TouchableScale>
          </View>
        </Card>

        {/* Academic Departments List */}
        <View style={styles.departmentsSection}>
          <Text style={styles.sectionTitleHeader}>Akademik Programlar ({faculty.departments.length})</Text>
          {faculty.departments.map((dept) => (
            <DeptCard key={dept.id} dept={dept} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },

  // Faculty Brand Card
  brandCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
    borderRadius: rs(20),
  },
  facultyIconContainer: {
    width: rs(64),
    height: rs(64),
    borderRadius: rs(32),
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  facultyName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  facultyCode: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    marginTop: rs(2),
  },
  facultyDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  // Dean/Management Card
  infoCard: {
    marginBottom: spacing.md,
    borderRadius: rs(20),
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: spacing.xs,
  },
  deanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  deanTextWrap: {
    flex: 1,
  },
  deanName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  deanRole: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    marginTop: rs(1),
  },

  // Contact list
  contactContainer: {
    gap: spacing.xs,
  },
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
  contactTextWrap: {
    flex: 1,
  },
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

  // Departments list Section
  departmentsSection: {
    marginTop: spacing.md,
  },
  sectionTitleHeader: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.md,
    marginLeft: rs(4),
  },

  // Department Card Styles
  deptCard: {
    marginBottom: spacing.sm,
    borderRadius: rs(14),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  deptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  deptTitleWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  deptName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  deptBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rs(6),
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: rs(2),
    borderRadius: rs(4),
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderColor: colors.badgeGreenBg,
  },
  badgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  langBadgeText: {
    color: colors.badgeGreenText,
  },

  // Expanded Department Content
  deptContent: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    padding: spacing.base,
    backgroundColor: colors.background + '50', // %30 opacity
  },
  deptDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },

  // Career Section inside Department
  careerSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  careerTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  careerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: rs(6),
  },
  careerDot: {
    marginTop: rs(5),
    marginRight: spacing.sm,
  },
  careerText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
});
