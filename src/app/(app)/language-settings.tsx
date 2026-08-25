import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || 'en');

  useEffect(() => {
    // Sync local state when language changes
    setSelectedLang(i18n.language);
  }, [i18n.language]);

  const handleSave = async () => {
    await i18n.changeLanguage(selectedLang);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          {t('languageSettings.title', 'Language')}
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <AppText variant="h2" style={styles.pageTitle}>
          {t('languageSettings.choose', 'Choose Language')}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.pageSubtitle}>
          {t('languageSettings.selectPreferred', 'Select your preferred language')}
        </AppText>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.langOption,
              selectedLang === 'ta' && styles.langOptionSelected
            ]}
            onPress={() => setSelectedLang('ta')}
            activeOpacity={0.8}
          >
            <AppText variant="h2" style={[styles.langTextMain, selectedLang === 'ta' && styles.langTextSelected]}>
              தமிழ்
            </AppText>
            <AppText variant="body" style={[styles.langTextSub, selectedLang === 'ta' && styles.langTextSelected]}>
              Tamil
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.langOption,
              selectedLang === 'en' && styles.langOptionSelected
            ]}
            onPress={() => setSelectedLang('en')}
            activeOpacity={0.8}
          >
            <AppText variant="body" style={[styles.langTextSingle, selectedLang === 'en' && styles.langTextSelected]}>
              English
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color="white" style={{ marginRight: 8 }} />
            <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>
              {t('languageSettings.save', 'Save Preference')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    padding: spacing.xl,
    zIndex: 10,
  },
  pageTitle: {
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    marginBottom: spacing.xxl,
  },
  optionsContainer: {
    marginBottom: spacing.xxl,
  },
  langOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  langOptionSelected: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  langTextMain: {
    fontSize: 22,
    marginBottom: 4,
    color: colors.text,
  },
  langTextSub: {
    color: colors.textSecondary,
  },
  langTextSingle: {
    fontSize: 18,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  langTextSelected: {
    color: 'white',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803d',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
});
