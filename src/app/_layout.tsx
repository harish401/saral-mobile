import React, { useEffect, useState } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { ActivityIndicator, View, Image, StyleSheet } from 'react-native';
import '../i18n';
import { apiFetch } from '../utils/apiClient';
import { AppText } from '../components/ui/AppText';
import { colors, spacing } from '../theme/theme';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkMaintenance() {
      try {
        const data = await apiFetch('/auth/global-settings', { timeoutMs: 6000 });
        
        if (isMounted) {
          if (data?.isMaintenanceMode) {
            setIsMaintenance(true);
            if (pathname !== '/maintenance') {
              router.replace('/maintenance');
            }
          } else {
            setIsMaintenance(false);
            if (pathname === '/maintenance') {
              router.replace('/');
            }
          }
        }
      } catch (e: any) {
        console.log('Maintenance check status:', e.message);
      } finally {
        if (isMounted) {
          setCheckingMaintenance(false);
        }
      }
    }

    checkMaintenance();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingMaintenance && pathname !== '/maintenance') {
    return (
      <View style={splashStyles.container}>
        <View style={splashStyles.logoBox}>
          <Image 
            source={require('../../assets/images/image.png')} 
            style={splashStyles.logoImage} 
            resizeMode="contain" 
          />
          <AppText variant="h1" color={colors.primaryDark} style={splashStyles.logoTitle}>
            SAARAL
          </AppText>
          <AppText variant="h3" color={colors.primaryDark} style={splashStyles.logoSubtitle}>
            SALARY
          </AppText>
        </View>

        <View style={splashStyles.loaderBox}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="maintenance" />
    </Stack>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
    marginBottom: spacing.md,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  logoSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.primary,
    marginTop: 2,
  },
  loaderBox: {
    position: 'absolute',
    bottom: 50,
  },
});
