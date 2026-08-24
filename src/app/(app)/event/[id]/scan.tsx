import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../../components/ui/AppText';
import { colors, spacing } from '../../../../theme/theme';
import { useAuthStore } from '../../../../store/authStore';

import { BACKEND_URL } from '../../../../config/api.config';
// const BACKEND_URL = 'http://192.168.31.156:3000';
export default function QRScannerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for check-in');
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsCheckingIn(true);

    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({});

      // Perform Check-in
      const res = await fetch(`${BACKEND_URL}/events/${id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          qrToken: data,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
      });

      if (res.ok) {
        router.replace({
          pathname: '/(app)/checkin-success' as any,
          params: {
            eventTitle: 'Event Cleanup Check-in',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' (' + new Date().toLocaleDateString('en-US', { weekday: 'short' }) + ')',
            location: 'Event Location',
          }
        });
      } else {
        const errData = await res.json();
        Alert.alert('Check-in Failed', errData.message || 'Could not verify location or QR code.', [
          { text: 'Try Again', onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      console.log('Check-in error', error);
      Alert.alert('Error', 'An error occurred while checking in.', [
        { text: 'Try Again', onPress: () => setScanned(false) }
      ]);
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator color={colors.primary} /></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <AppText>No access to camera</AppText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <AppText color={colors.primary}>Go Back</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Ionicons name="scan-outline" size={40} color={colors.text} style={{ marginBottom: 8 }} />
        <AppText variant="h2" color={colors.text}>Scan the Event QR Code</AppText>
        <AppText variant="body" color={colors.textSecondary}>at the event entrance to check-in</AppText>
      </View>

      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          enableTorch={flashlightOn}
          style={styles.camera}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        <View style={styles.instructionRow}>
          <Ionicons name="information-circle-outline" size={20} color="#15803d" />
          <AppText variant="body" color={colors.text} style={{ marginLeft: 8 }}>
            Align QR code within the frame to scan
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.flashlightBtn}
          onPress={() => setFlashlightOn(!flashlightOn)}
        >
          <Ionicons name={flashlightOn ? "flash" : "flash-outline"} size={20} color="#15803d" />
          <AppText variant="body" style={{ color: '#15803d', fontWeight: '600', marginLeft: 8 }}>
            {flashlightOn ? 'Turn off Flashlight' : 'Turn on Flashlight'}
          </AppText>
        </TouchableOpacity>

        {/* Fallback for Simulator testing */}
        <TouchableOpacity
          style={[styles.flashlightBtn, { marginTop: 12, backgroundColor: '#f3f4f6', borderColor: '#d1d5db' }]}
          onPress={() => {
            Alert.prompt(
              'Simulator Bypass',
              'Enter the QR token shown in the Admin Dashboard to simulate a scan:',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: (text?: string) => text && handleBarCodeScanned({ type: 'manual', data: text.trim() }) }
              ]
            );
          }}
        >
          <Ionicons name="code-working-outline" size={20} color={colors.textSecondary} />
          <AppText variant="body" style={{ color: colors.textSecondary, fontWeight: '600', marginLeft: 8 }}>
            Simulate Scan (For Testing)
          </AppText>
        </TouchableOpacity>
      </View>

      {isCheckingIn && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <AppText style={{ color: 'white', marginTop: 12 }}>Verifying Location & Check-in...</AppText>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: spacing.md },
  backButton: { padding: spacing.xs },
  titleContainer: { alignItems: 'center', marginVertical: spacing.lg },
  scannerContainer: { flex: 1, marginHorizontal: spacing.xl, overflow: 'hidden', borderRadius: 24, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#15803d', backgroundColor: 'transparent' },
  footer: { padding: spacing.xl, alignItems: 'center' },
  instructionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  flashlightBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, borderWidth: 1, borderColor: '#15803d' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
});
