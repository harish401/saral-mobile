import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import LighthouseIllustration from '../../components/illustrations/LighthouseIllustration';

const { width } = Dimensions.get('window');

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleSelectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    router.push('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { paddingBottom: Math.max(insets.bottom + 12, spacing.lg) }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <AppText variant="h1" align="center" color={colors.text} style={styles.title}>
            {t('language_selection.title')}
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
            {t('language_selection.subtitle')}
          </AppText>

          <AppText variant="h3" align="left" color={colors.text} style={styles.sectionTitle}>
            {t('language_selection.language_preference')}
          </AppText>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionCard, i18n.language === 'ta' && styles.optionCardSelected]}
              onPress={() => handleSelectLanguage('ta')}
              activeOpacity={0.7}
            >
              <AppText variant="h2" color={i18n.language === 'ta' ? colors.surface : colors.text} align="center">
                {t('language_selection.tamil')}
              </AppText>
              <AppText variant="body" color={i18n.language === 'ta' ? colors.surface : colors.textSecondary} align="center">
                Tamil
              </AppText>
              {i18n.language === 'ta' && (
                <View style={styles.checkIconPlaceholder} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionCard, i18n.language === 'en' && styles.optionCardSelected]}
              onPress={() => handleSelectLanguage('en')}
              activeOpacity={0.7}
            >
              <AppText variant="h2" color={i18n.language === 'en' ? colors.surface : colors.text} align="center">
                {t('language_selection.english')}
              </AppText>
              <AppText variant="body" color={i18n.language === 'en' ? colors.surface : colors.textSecondary} align="center">
                English
              </AppText>
              {i18n.language === 'en' && (
                <View style={styles.checkIconPlaceholder} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.illustrationContainer}>
          <LighthouseIllustration width={width} height={Math.min(width * 0.75, 260)} />
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
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIconPlaceholder: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});
