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

export default function BankScreen() {
  const router = useRouter();
  const { updateOnboardingData } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'bank' | 'upi'>('bank');
  
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleContinue = () => {
    if (activeTab === 'bank') {
      updateOnboardingData({
        bankDetails: {
          accountNumber,
          ifscCode: ifsc,
          accountHolderName: holderName,
        }
      } as any);
    } else {
      updateOnboardingData({
        bankDetails: { upiId }
      } as any);
    }
    router.push('/(onboarding)/location');
  };

  const isFormValid = activeTab === 'bank' 
    ? accountNumber.trim() && ifsc.trim() && holderName.trim()
    : upiId.trim();

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
          <AppText variant="h1" align="center" style={styles.headerTitle}>Link Bank Account</AppText>
          <AppText variant="body" align="center" color={colors.textSecondary}>Step 3 of 5</AppText>
        </View>

        <StepIndicator currentStep={3} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Image 
            source={require('../../../assets/images/image copy 6.png')}
            style={styles.illustration}
          />
          
          <AppText variant="h2" style={styles.sectionTitle}>Add your bank account</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
            Rewards will be transferred securely to your bank account
          </AppText>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'bank' && styles.tabActive]}
              onPress={() => setActiveTab('bank')}
            >
              <AppText variant="body" style={{ fontWeight: activeTab === 'bank' ? '600' : '400' }} color={activeTab === 'bank' ? colors.primary : colors.text}>Bank Details</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'upi' && styles.tabActive]}
              onPress={() => setActiveTab('upi')}
            >
              <AppText variant="body" style={{ fontWeight: activeTab === 'upi' ? '600' : '400' }} color={activeTab === 'upi' ? colors.primary : colors.text}>UPI ID</AppText>
            </TouchableOpacity>
          </View>

          {activeTab === 'bank' ? (
            <>
              <View style={styles.formGroup}>
                <AppText variant="body" style={styles.label}>Account Number</AppText>
                <AppInput 
                  placeholder="Enter account number" 
                  value={accountNumber} 
                  onChangeText={setAccountNumber} 
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <AppText variant="body" style={styles.label}>IFSC Code</AppText>
                <AppInput 
                  placeholder="Enter IFSC Code" 
                  value={ifsc} 
                  onChangeText={setIfsc}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <AppText variant="body" style={styles.label}>Account Holder Name</AppText>
                <AppInput 
                  placeholder="Name as per bank account" 
                  value={holderName} 
                  onChangeText={setHolderName} 
                />
              </View>
            </>
          ) : (
            <View style={styles.formGroup}>
              <AppText variant="body" style={styles.label}>UPI ID</AppText>
              <AppInput 
                placeholder="Enter UPI ID (e.g., name@okicici)" 
                value={upiId} 
                onChangeText={setUpiId} 
                autoCapitalize="none"
              />
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Continue →" 
            onPress={handleContinue} 
            style={styles.continueButton}
            disabled={!isFormValid}
          />
          <View style={styles.secureContainer}>
            <AppText variant="h2" style={styles.secureIcon}>🔒</AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.secureText}>
              Your bank details are 100% secure{'\n'}and encrypted
            </AppText>
          </View>
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
  tabContainer: { flexDirection: 'row', marginBottom: spacing.lg, borderRadius: borderRadius.md, backgroundColor: '#F8FAFC', padding: 4 },
  tabButton: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  formGroup: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs, fontWeight: '600', color: colors.text },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, paddingTop: spacing.md, backgroundColor: colors.surface },
  continueButton: { backgroundColor: '#74B686', marginBottom: spacing.md },
  secureContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secureIcon: { fontSize: 24, marginRight: spacing.sm },
  secureText: { lineHeight: 16 },
});
