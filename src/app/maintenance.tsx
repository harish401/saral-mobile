import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppText } from '../components/ui/AppText';
import { AppButton } from '../components/ui/AppButton';
import { colors, spacing, borderRadius } from '../theme/theme';
import { apiFetch } from '../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function MaintenanceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('We are currently conducting scheduled system maintenance to improve our services.');

  const checkStatus = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const data = await apiFetch<any>('/auth/global-settings', { timeoutMs: 8000 });
      if (data?.maintenanceMessage) {
        setMessage(data.maintenanceMessage);
      }

      if (!data?.isMaintenanceMode) {
        // Maintenance mode turned OFF -> return back to app!
        router.replace('/');
      }
    } catch (e) {
      console.log('Status check error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={checkStatus} colors={[colors.primary]} />}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="construct" size={56} color={colors.primary} />
        </View>

        <AppText variant="h1" align="center" style={styles.title}>
          {t('maintenance.title', 'Under Maintenance')}
        </AppText>

        <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
          {message}
        </AppText>

        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={24} color={colors.primaryDark} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <AppText variant="h3" color={colors.primaryDark} style={{ fontSize: 15, marginBottom: 2 }}>
              {t('maintenance.estimatedTime', 'Estimated Up Time')}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {t('maintenance.info', 'Our team is working on server upgrades. Thank you for your patience!')}
            </AppText>
          </View>
        </View>

        <AppButton 
          title={loading ? t('common.checking', 'Checking...') : t('maintenance.retry', 'Check App Status')}
          onPress={checkStatus}
          isLoading={loading}
          icon={<Ionicons name="refresh-outline" size={20} color="#ffffff" />}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight || '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
  },
});
