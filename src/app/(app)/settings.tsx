import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          {t('settings.title', 'Settings')}
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <AppText variant="h3" color={colors.text}>Account Status</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {user?.documentVerificationStatus === 'VERIFIED' ? 'Your identity is verified' : 
                 user?.documentVerificationStatus === 'REJECTED' ? 'Verification rejected' : 'Pending verification from Organiser'}
              </AppText>
            </View>
            {user?.documentVerificationStatus === 'VERIFIED' ? (
              <Ionicons name="checkmark-circle" size={24} color="#15803d" />
            ) : user?.documentVerificationStatus === 'REJECTED' ? (
              <Ionicons name="close-circle" size={24} color="#dc2626" />
            ) : (
              <Ionicons name="time-outline" size={24} color="#f59e0b" />
            )}
          </View>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <AppText variant="h3" color={colors.text}>{t('settings.notifications', 'Notifications')}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>{t('settings.notificationsDesc', 'Manage notification preferences')}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/(app)/language-settings')}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="language-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <AppText variant="h3" color={colors.text}>{t('settings.language', 'Language')}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>{t('settings.languageDesc', 'Change app language')}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 8 }} />
          <AppText variant="body" style={{ color: '#dc2626', fontWeight: 'bold' }}>
            {t('settings.logout', 'Logout from App')}
          </AppText>
        </TouchableOpacity>

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
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 70,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
});
