import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { colors, spacing, borderRadius } from '../../theme/theme';
import WelcomeIllustration from '../../components/illustrations/WelcomeIllustration';
import LighthouseIllustration from '../../components/illustrations/LighthouseIllustration';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.push('/(auth)/account-type');
  };

  const illustrationHeight = Math.min(width * 0.65, 230);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingBottom: Math.max(insets.bottom + 16, spacing.xl) }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <WelcomeIllustration width={100} height={100} />
            <AppText variant="h1" color={colors.primaryDark} style={styles.logoText}>SAARAL</AppText>
            <AppText variant="h3" color={colors.primaryDark} style={styles.logoSubText}>SALARY</AppText>
          </View>
        </View>

        <View style={styles.textSection}>
          <AppText variant="h1" color={colors.text} style={styles.title}>
            {t('onboarding.title_part1')}
          </AppText>
          <AppText variant="h1" color={colors.primary} style={styles.titlePart2}>
            {t('onboarding.title_part2')}
          </AppText>
          
          <AppText variant="h3" color={colors.text} style={styles.subtitle}>
            {t('onboarding.subtitle')}
          </AppText>
          
          <AppText variant="body" color={colors.textSecondary} style={styles.description}>
            {t('onboarding.description')}
          </AppText>
        </View>

        <View style={styles.illustrationContainer}>
          <LighthouseIllustration width={width} height={illustrationHeight} />
        </View>

        <View style={styles.footer}>
          {/* Pagination dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <AppButton 
            title={t('onboarding.get_started', 'Get Started')}
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    marginTop: spacing.xs,
    letterSpacing: 1.5,
    fontSize: 22,
    fontWeight: '800',
  },
  logoSubText: {
    letterSpacing: 2,
    fontSize: 14,
    fontWeight: '600',
  },
  textSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  titlePart2: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    backgroundColor: colors.surface,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  button: {
    width: '100%',
  }
});
