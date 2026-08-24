import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';

export default function SubmissionSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    submissionId?: string;
    weightKg?: string;
    date?: string;
    location?: string;
  }>();

  const submissionId = params.submissionId || `SUB${Date.now().toString().slice(-8)}`;
  const weight = params.weightKg || '12.05';
  const dateStr = params.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 10:30 AM';
  const locationStr = params.location || 'Chengalpattu, Tamil Nadu';

  const handleCopyId = () => {
    Alert.alert('Copied', `Submission ID ${submissionId} copied to clipboard!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(app)/' as any)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          Submission Approved
        </AppText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Big Checkmark Circle */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={64} color="#15803d" />
          </View>
        </View>

        {/* Title & Subtitle */}
        <AppText variant="h1" style={styles.successTitle}>
          Great Job !
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Your cleanup submission has been approved.
        </AppText>

        {/* Info Card */}
        <AppCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <AppText variant="bodySecondary" color={colors.text}>Submitted On</AppText>
            <AppText variant="bodySecondary" style={styles.infoValue}>{dateStr}</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <AppText variant="bodySecondary" color={colors.text}>Weight</AppText>
            <AppText variant="bodySecondary" style={styles.infoValue}>{weight} KG</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <AppText variant="bodySecondary" color={colors.text}>Location</AppText>
            <AppText variant="bodySecondary" style={[styles.infoValue, { textAlign: 'right', flex: 1, marginLeft: 16 }]}>
              {locationStr}
            </AppText>
          </View>

          {/* Submission ID Container */}
          <TouchableOpacity style={styles.submissionIdBox} onPress={handleCopyId}>
            <View style={styles.idIconCircle}>
              <Ionicons name="person-outline" size={20} color="#15803d" />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <AppText variant="caption" style={{ color: '#15803d', fontWeight: 'bold' }}>
                Submission ID
              </AppText>
              <AppText variant="bodySecondary" style={{ fontWeight: 'bold', color: colors.text }}>
                {submissionId}
              </AppText>
            </View>
            <Ionicons name="copy-outline" size={22} color="#15803d" />
          </TouchableOpacity>
        </AppCard>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(app)/submissions' as any)}
        >
          <AppText variant="h3" style={{ color: 'white', fontWeight: 'bold' }}>
            View My Submission
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(app)/' as any)}
        >
          <AppText variant="h3" style={{ color: colors.text, fontWeight: 'bold' }}>
            Back to Home
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    color: '#15803d',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  infoCard: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoValue: {
    fontWeight: 'bold',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: spacing.sm,
  },
  submissionIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  idIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
});
