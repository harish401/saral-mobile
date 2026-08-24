import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { updateOnboardingData } = useAuthStore();
  
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const handleContinue = () => {
    // Save to local authStore temporarily before final submit
    updateOnboardingData({ name, dateOfBirth: dob, gender } as any);
    router.push('/(onboarding)/documents');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AppText variant="h2" color={colors.text}>←</AppText>
          </TouchableOpacity>
          <AppText variant="h1" align="center" style={styles.headerTitle}>Create Account</AppText>
          <AppText variant="body" align="center" color={colors.textSecondary}>Step 1 of 5</AppText>
        </View>

        <StepIndicator currentStep={1} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Image 
            source={require('../../../assets/images/image copy 4.png')}
            style={styles.illustration}
          />
          
          <AppText variant="h2" style={styles.sectionTitle}>Let's start with your basic details</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
            This information helps us personalize your experience
          </AppText>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>Full Name</AppText>
            <AppInput 
              placeholder="Enter the Name" 
              value={name} 
              onChangeText={setName} 
            />
          </View>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>Date of Birth</AppText>
            <AppInput 
              placeholder="DD / MM / YYYY" 
              value={dob} 
              onChangeText={setDob} 
            />
          </View>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>Gender</AppText>
            <View style={styles.genderRow}>
              {['Male', 'Female', 'Other'].map((g) => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.genderButton, gender === g && styles.genderActive]}
                  onPress={() => setGender(g)}
                >
                  <AppText 
                    variant="body" 
                    color={gender === g ? colors.primary : colors.text}
                    style={{ fontWeight: gender === g ? '600' : '400' }}
                  >
                    {g}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Continue →" 
            onPress={handleContinue} 
            style={styles.continueButton}
            disabled={!name || !dob || !gender}
          />
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
            <AppText variant="body" color={colors.textSecondary} align="center">
              Already have an account? <AppText color={colors.primary} style={{fontWeight: '600'}}>Login</AppText>
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  illustration: { width: '100%', height: width * 0.5, resizeMode: 'contain', marginVertical: spacing.lg },
  sectionTitle: { fontSize: 20, marginBottom: spacing.xs },
  sectionSubtitle: { marginBottom: spacing.xl },
  formGroup: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs, fontWeight: '600', color: colors.text },
  genderRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  genderButton: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: colors.border, 
    paddingVertical: spacing.md, 
    borderRadius: borderRadius.md,
    alignItems: 'center' 
  },
  genderActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '20' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl * 2, paddingTop: spacing.md, backgroundColor: colors.surface },
  continueButton: { backgroundColor: '#74B686' },
  loginLink: { marginTop: spacing.md },
});
