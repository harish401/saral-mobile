import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../utils/apiClient';

const OTP_LENGTH = 6;

export default function VerifyScreen() {
  const { email, bypass } = useLocalSearchParams<{ email: string, bypass: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, onboardingData } = useAuthStore();
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerCount, setTimerCount] = useState(30);
  const [resending, setResending] = useState(false);
  
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus immediately
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timerCount <= 0) return;
    const interval = setInterval(() => {
      setTimerCount(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerCount]);

  const handleVerify = async (code: string) => {
    if (code.length < OTP_LENGTH || loading) return;
    
    try {
      setLoading(true);
      setError('');
      if (!email) throw new Error("No email provided. Please try logging in again.");
      
      // Handle the DUMMY_BYPASS for local testing
      if (bypass === 'true') {
        login({
          id: 'local_bypass_id',
          ...onboardingData,
          phone: onboardingData?.phone || '',
          role: 'employee',
          onboardingStatus: onboardingData ? 'SUBMITTED' : 'INCOMPLETE' 
        } as any, 'dummy_jwt_token', !!onboardingData);
        return;
      }
      
      // Call the NestJS Backend for Email OTP verify via apiFetch
      const data = await apiFetch<any>('/auth/email/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.toLowerCase(),
          otp: code,
          onboardingData: onboardingData || undefined
        })
      });
      
      // Store in Zustand
      const isNewRegistration = !!onboardingData;
      login(
        {
          ...data.user,
          phone: data.user?.phone || '',
          role: data.user?.role || 'employee',
          onboardingStatus: data.user?.onboardingStatus || (isNewRegistration ? 'INCOMPLETE' : 'SUBMITTED')
        },
        data.access_token,
        isNewRegistration
      );

      if (isNewRegistration) {
        router.replace('/(onboarding)/success');
      } else if (data.user?.onboardingStatus === 'INCOMPLETE') {
        router.replace('/(onboarding)/profile');
      } else {
        router.replace('/(app)');
      }
      
    } catch (err: any) {
      console.log('Verification Error:', err);
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= OTP_LENGTH) {
      setOtp(numericText);
      if (error) setError('');
      
      // Auto-submit when 6 digits are entered
      if (numericText.length === OTP_LENGTH) {
        handleVerify(numericText);
      }
    }
  };

  const handleResendOtp = async () => {
    if (timerCount > 0 || resending) return;
    try {
      setResending(true);
      setError('');
      await apiFetch('/auth/email/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: email?.toLowerCase() })
      });
      setTimerCount(30);
      setOtp('');
      inputRef.current?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const renderOtpBlocks = () => {
    const blocks = [];
    for (let i = 0; i < OTP_LENGTH; i++) {
      const digit = otp[i] || '';
      const isFocused = otp.length === i;
      
      blocks.push(
        <View 
          key={i} 
          style={[
            styles.otpBlock, 
            isFocused && styles.otpBlockFocused,
            error ? styles.otpBlockError : null
          ]}
        >
          <AppText variant="h2" color={colors.text}>{digit}</AppText>
        </View>
      );
    }
    return blocks;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, spacing.xl) }
          ]}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AppText variant="h2" color={colors.text}>←</AppText>
          </TouchableOpacity>

          <View style={styles.header}>
            <AppText variant="h1" align="center" color={colors.text} style={styles.title}>
              {t('auth.verify_title', 'Verify your number')}
            </AppText>
            <AppText variant="body" align="center" color={colors.textSecondary}>
              {t('auth.verify_subtitle', 'Enter the 6-digit OTP sent to')}
            </AppText>
            <AppText variant="body" align="center" color={colors.primary} style={{ fontWeight: '700', marginTop: 4 }}>
              {email || 'you@example.com'}
            </AppText>
          </View>

          <View style={styles.form}>
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={() => inputRef.current?.focus()}
              style={styles.otpWrapper}
            >
              <View style={styles.otpContainer}>
                {renderOtpBlocks()}
              </View>

              {/* Invisible full-area text input overlay so tapping anywhere triggers keyboard natively */}
              <TextInput
                ref={inputRef}
                style={styles.nativeOverlayInput}
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                caretHidden={true}
                autoFocus={true}
              />
            </TouchableOpacity>
            
            {loading && (
              <View style={{ marginTop: spacing.md }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}

            {error ? (
              <AppText color={colors.error} align="center" style={styles.errorText}>
                {error}
              </AppText>
            ) : null}
            
            <View style={styles.resendSection}>
              <AppText variant="body" color={colors.textSecondary}>
                {t('auth.did_not_receive', "Didn't receive OTP?")}{' '}
              </AppText>
              {timerCount > 0 ? (
                <AppText variant="body" color={colors.primary} style={{ fontWeight: '700' }}>
                  Resend in 00:{timerCount < 10 ? `0${timerCount}` : timerCount}
                </AppText>
              ) : (
                <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                  <AppText variant="body" color={colors.primary} style={{ fontWeight: '800', textDecorationLine: 'underline' }}>
                    {resending ? 'Sending...' : t('auth.resend_otp', 'Resend OTP')}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    paddingVertical: spacing.md,
    width: 48,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },
  otpWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: spacing.lg,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBlock: {
    flex: 1,
    height: 60,
    marginHorizontal: 4,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  otpBlockFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  otpBlockError: {
    borderColor: colors.error,
  },
  nativeOverlayInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.01,
    color: 'transparent',
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.sm,
  },
});
