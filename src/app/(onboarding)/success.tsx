import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function RegistrationSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearJustRegistered } = useAuthStore();

  const handleContinue = () => {
    clearJustRegistered();
    router.replace('/(app)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/image.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark-circle" size={50} color="#16a34a" />
          </View>
        </View>

        <AppText variant="h1" align="center" color={colors.text} style={{ marginTop: spacing.lg, fontSize: 26 }}>
          Registration
        </AppText>
        <AppText variant="h1" align="center" color="#16a34a" style={{ marginBottom: spacing.md, fontSize: 28, fontWeight: '800' }}>
          Successful !
        </AppText>

        <AppText variant="body" align="center" color={colors.textSecondary} style={{ marginBottom: spacing.xl, paddingHorizontal: spacing.xl, fontSize: 16 }}>
          Your Saaral Salary account has been created successfully. Welcome aboard!
        </AppText>

      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, spacing.xl) }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <AppText variant="body" style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Continue to App
          </AppText>
          <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  illustration: {
    width: 140,
    height: 140,
  },
  checkBadge: {
    marginTop: spacing.md,
    backgroundColor: '#f0fdf4',
    borderRadius: 30,
    padding: 4,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: '#ffffff',
  },
  continueButton: {
    backgroundColor: '#16a34a',
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
