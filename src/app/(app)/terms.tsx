import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';

export default function TermsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          {t('terms.title', 'Terms & Conditions')}
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            {t('terms.section1Title', '1. Introduction')}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.paragraph}>
            {t('terms.section1Text', 'Welcome to Saaral Salary. By using our application, you agree to these terms and conditions. Please read them carefully.')}
          </AppText>

          <AppText variant="h3" style={styles.sectionTitle}>
            {t('terms.section2Title', '2. Data Privacy')}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.paragraph}>
            {t('terms.section2Text', 'Your personal data, including identity documents and bank details, are securely stored and will only be used for the purpose of validating your identity and processing payments.')}
          </AppText>

          <AppText variant="h3" style={styles.sectionTitle}>
            {t('terms.section3Title', '3. User Responsibilities')}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.paragraph}>
            {t('terms.section3Text', 'You are responsible for maintaining the confidentiality of your account information. Any activity that occurs under your account is your responsibility.')}
          </AppText>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
    color: colors.text,
  },
  paragraph: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  }
});
