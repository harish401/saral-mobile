import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default function AccountTypeScreen() {
  const router = useRouter();

  const handleNewUser = () => {
    router.push('/(onboarding)/profile');
  };

  const handleExistingUser = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AppText variant="h2" color={colors.text}>←</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../../assets/images/image copy 3.png')} 
            style={{ width: width * 0.7, height: width * 0.7, resizeMode: 'contain' }} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <AppText variant="h1" align="center" color={colors.text} style={styles.title}>
            Welcome !
          </AppText>
          <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
            Do you have an account{'\n'}with us ?
          </AppText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleNewUser}
            activeOpacity={0.8}
          >
            <AppText variant="h3" color={colors.surface} align="center">
              No, I'm a New User
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleExistingUser}
            activeOpacity={0.8}
          >
            <AppText variant="h3" color={colors.textSecondary} align="center">
              Yes, I'm an Existing User
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  textContainer: {
    marginBottom: spacing.xxl * 2,
  },
  title: {
    fontSize: 28,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  buttonContainer: {
    gap: spacing.lg,
  },
  button: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#74B686', // From design
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  }
});
