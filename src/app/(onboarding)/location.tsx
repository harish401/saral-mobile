import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function LocationScreen() {
  const router = useRouter();
  const { updateOnboardingData } = useAuthStore();
  
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');

  const handleContinue = () => {
    updateOnboardingData({ state, district, village } as any);
    router.push('/(onboarding)/review');
  };

  const isFormValid = state.trim() && district.trim() && village.trim();

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
          <AppText variant="h1" align="center" style={styles.headerTitle}>Location Details</AppText>
          <AppText variant="body" align="center" color={colors.textSecondary}>Step 4 of 5</AppText>
        </View>

        <StepIndicator currentStep={4} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Image 
            source={require('../../../assets/images/image copy 7.png')}
            style={styles.illustration}
          />
          
          <AppText variant="h2" style={styles.sectionTitle}>Select your location</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
            This helps us connect you with nearby events and coordinators
          </AppText>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>State</AppText>
            <AppInput 
              placeholder="Select your State" 
              value={state} 
              onChangeText={setState} 
            />
          </View>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>District</AppText>
            <AppInput 
              placeholder="Select your District" 
              value={district} 
              onChangeText={setDistrict} 
            />
          </View>

          <View style={styles.formGroup}>
            <AppText variant="body" style={styles.label}>Village / Town</AppText>
            <AppInput 
              placeholder="Select your village" 
              value={village} 
              onChangeText={setVillage} 
            />
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Continue →" 
            onPress={handleContinue} 
            style={styles.continueButton}
            disabled={!isFormValid}
          />
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
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl * 2, paddingTop: spacing.md, backgroundColor: colors.surface },
  continueButton: { backgroundColor: '#74B686' },
});
