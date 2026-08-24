import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function RegistrationSuccessScreen() {
  const router = useRouter();
  const { clearJustRegistered } = useAuthStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>

        <View style={styles.imageContainer}>
          {/* <Image
            source={require('../../assets/images/image copy 8.png')}
            style={styles.illustration}
            resizeMode="contain"
          /> */}
        </View>

        <AppText variant="h2" align="center" color={colors.text} style={{ marginTop: spacing.xl }}>
          Registration
        </AppText>
        <AppText variant="h2" align="center" color="#15803d" style={{ marginBottom: spacing.md }}>
          Successful !
        </AppText>

        <AppText variant="body" align="center" color={colors.textSecondary} style={{ marginBottom: spacing.xl, paddingHorizontal: spacing.xl }}>
          Your account has been created successfully.
        </AppText>

        <AppText variant="caption" align="center" color={colors.textSecondary} style={{ paddingHorizontal: spacing.xxl }}>
          Watch this short video to learn about Saaral Salary.
        </AppText>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            clearJustRegistered();
            router.replace('/(app)');
          }}
        >
          <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>Continue</AppText>
          <Ionicons name="arrow-forward" size={20} color="white" style={{ position: 'absolute', right: spacing.lg }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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
    marginBottom: spacing.xl,
  },
  illustration: {
    width: 250,
    height: 250,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  continueButton: {
    backgroundColor: '#15803d',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
