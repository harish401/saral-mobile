import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { colors, spacing } from '../../theme/theme';
import WelcomeIllustration from '../../components/illustrations/WelcomeIllustration';
import { useAuthStore } from '../../store/authStore';
import { apiFetch } from '../../utils/apiClient';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { onboardingData } = useAuthStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError(t('auth.invalid_email', 'Please enter a valid email address'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const isSignup = !!onboardingData;
      await apiFetch('/auth/email/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase(), isSignup })
      });

      setLoading(false);

      router.push({
        pathname: '/(auth)/verify',
        params: { email: email.toLowerCase() }
      });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP');
      console.log('OTP Send Error:', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <WelcomeIllustration width={140} height={140} />
            <AppText variant="h1" align="center" style={styles.title}>
              {t('auth.login_title', 'Welcome Back')}
            </AppText>
            <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
              {t('auth.login_subtitle', 'Enter your email address to receive a one-time verification code.')}
            </AppText>
          </View>

          <View style={styles.form}>
            <AppInput
              label={t('auth.email_label', 'Email Address')}
              placeholder={t('auth.email_placeholder', 'name@example.com')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={error}
            />

            <AppButton
              title={loading ? t('auth.sending_otp', 'Sending Code...') : t('auth.send_otp', 'Send Verification Code')}
              onPress={handleSendOtp}
              isLoading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="caption" align="center" color={colors.textSecondary}>
              {t('auth.terms_notice', 'By continuing, you agree to our Terms of Service & Privacy Policy.')}
            </AppText>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  form: {
    marginVertical: spacing.xl,
  },
  button: {
    marginTop: spacing.md,
  },
  footer: {
    marginBottom: spacing.md,
  },
});
