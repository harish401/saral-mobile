import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import { BACKEND_URL } from '../../config/api.config';

export default function ReviewScreen() {
  const router = useRouter();
  const { onboardingData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const u: any = onboardingData || {};

  const maskAccount = (acc: string) => {
    if (!acc) return '';
    if (acc.length < 4) return acc;
    return `***** ***** ${acc.slice(-4)}`;
  };

  const handleSubmit = async () => {
    if (!confirmed) {
      Alert.alert("Confirmation Required", "Please confirm that all details are correct.");
      return;
    }
    // We do NOT hit the backend yet. The data is held in authStore.
    // We send the user to the login (email OTP) screen to authenticate.
    // Upon successful OTP verification, the data will be sent to the backend.
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AppText variant="h2" color={colors.text}>←</AppText>
          </TouchableOpacity>
          <AppText variant="h1" align="center" style={styles.headerTitle}>Review & Confirm</AppText>
          <AppText variant="body" align="center" color={colors.textSecondary}>Step 5 of 5</AppText>
        </View>

        <StepIndicator currentStep={5} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <AppText variant="h2" style={styles.sectionTitle}>Please review your details</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Make sure all the information is correct before submitting
          </AppText>

          <View style={styles.summaryCard}>
            <View style={styles.summarySection}>
              <AppText variant="h3" style={styles.summaryTitle}>Personal Details</AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {u.name || 'N/A'}, {u.dateOfBirth || 'N/A'}, {u.gender || 'N/A'}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.summarySection}>
              <AppText variant="h3" style={styles.summaryTitle}>Identity Document</AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {u.aadhaar ? 'Aadhaar Card' : u.rationCard ? 'Ration Card' : 'None Uploaded'}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.summarySection}>
              <AppText variant="h3" style={styles.summaryTitle}>Bank Account</AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {u.bankDetails?.accountNumber 
                  ? maskAccount(u.bankDetails.accountNumber) 
                  : u.bankDetails?.upiId || 'Not Provided'}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.summarySection}>
              <AppText variant="h3" style={styles.summaryTitle}>Location</AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {[u.state, u.district, u.village].filter(Boolean).join(', ')}
              </AppText>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setConfirmed(!confirmed)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <AppText variant="caption" color={colors.surface} style={styles.checkMark}>✓</AppText>}
            </View>
            <AppText variant="body" color={colors.textSecondary} style={{ flex: 1 }}>
              I confirm this all the details provided are correct.
            </AppText>
          </TouchableOpacity>

        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Submit" 
            onPress={handleSubmit} 
            style={styles.submitButton}
            isLoading={loading}
            disabled={!confirmed}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  container: { flex: 1 },
  header: { paddingTop: spacing.md, paddingHorizontal: spacing.xl },
  backButton: { position: 'absolute', left: spacing.xl, top: spacing.md, zIndex: 10 },
  headerTitle: { fontSize: 24 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  sectionTitle: { fontSize: 20, marginBottom: spacing.xs, marginTop: spacing.md },
  sectionSubtitle: { marginBottom: spacing.xl },
  summaryCard: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: borderRadius.md, 
    backgroundColor: '#F8FAFC',
    marginBottom: spacing.xl 
  },
  summarySection: { padding: spacing.lg },
  summaryTitle: { marginBottom: spacing.xs, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  checkbox: { 
    width: 24, height: 24, 
    borderWidth: 1, borderColor: colors.primary, 
    borderRadius: 4, 
    marginRight: spacing.md,
    justifyContent: 'center', alignItems: 'center'
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkMark: { fontWeight: 'bold' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl * 2, paddingTop: spacing.md, backgroundColor: colors.surface },
  submitButton: { backgroundColor: '#74B686' },
});
