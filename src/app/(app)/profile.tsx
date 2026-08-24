import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
};

const MenuItem = ({ icon, title, subtitle, onPress, isLast }: MenuItemProps) => (
  <View>
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.menuTextContainer}>
        <AppText variant="h3" color={colors.text}>{title}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>{subtitle}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
    {!isLast && <View style={styles.divider} />}
  </View>
);

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      router.replace('/(auth)/language');
    }
  };

  const name = user?.name || 'User';
  const phone = user?.phone || '';
  const location = [user?.district, user?.state].filter(Boolean).join(', ') || 'Location not set';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 60 }]}
      >
        
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={user?.photoUrl ? { uri: user.photoUrl } : require('../../../assets/default-avatar.png')}
            style={styles.avatar}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <AppText variant="h2" style={styles.name}>{name}</AppText>
            {user?.onboardingStatus === 'APPROVED' && (
              <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={14} color="#15803d" style={{ marginRight: 2 }} />
                <AppText variant="caption" style={{ color: '#15803d', fontWeight: 'bold' }}>Verified</AppText>
              </View>
            )}
          </View>
          {phone ? <AppText variant="body" color={colors.textSecondary}>{phone}</AppText> : null}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <AppText variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
              {location}
            </AppText>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon="person-outline"
            title={t('profile.personalDetails', 'Personal Details')}
            subtitle={t('profile.personalDetailsDesc', 'View and edit your profile information')}
            onPress={() => router.push('/(app)/personal-details')}
          />
          <MenuItem 
            icon="card-outline"
            title={t('profile.bankDetails', 'Bank Details')}
            subtitle={t('profile.bankDetailsDesc', 'Manage bank & UPI information')}
            onPress={() => router.push('/(app)/bank-details')}
          />
          <MenuItem 
            icon="language-outline"
            title={t('profile.language', 'Language')}
            subtitle={t('profile.languageDesc', 'Choose your preferred language')}
            onPress={() => router.push('/(app)/language-settings')}
          />
          <MenuItem 
            icon="document-text-outline"
            title={t('profile.terms', 'Terms & Conditions')}
            subtitle={t('profile.termsDesc', 'Read our policies')}
            onPress={() => router.push('/(app)/terms')}
          />
          <MenuItem 
            icon="settings-outline"
            title={t('profile.settings', 'Settings')}
            subtitle={t('profile.settingsDesc', 'App settings & preferences')}
            onPress={() => router.push('/(app)/settings')}
            isLast
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 8 }} />
          <AppText variant="body" style={{ color: '#dc2626', fontWeight: 'bold' }}>
            {t('profile.logout', 'Logout')}
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    backgroundColor: '#e2e8f0',
  },
  name: {
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
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
    marginTop: spacing.sm,
  },
});
