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
        <Image 
          source={require('../../assets/images/image copy 9.png')} 
          style={splashStyles.fullSplashImage} 
          resizeMode="contain" 
        />
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
    padding: spacing.md,
  },
  fullSplashImage: {
    width: '80%',
    height: '60%',
  },
  loaderBox: {
    position: 'absolute',
    bottom: 50,
  },
});
