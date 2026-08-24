import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function DocumentsScreen() {
  const router = useRouter();
  const { updateOnboardingData } = useAuthStore();
  
  const [docType, setDocType] = useState('Aadhaar Card');
  const [docUri, setDocUri] = useState('');

  const handlePick = () => {
    Alert.alert('Upload Document', 'Choose how you want to upload', [
      { text: 'Take a Photo / Gallery', onPress: pickImage },
      { text: 'Pick a File', onPress: pickDocument },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setDocUri(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    
    if (!result.canceled) {
      setDocUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (docType === 'Aadhaar Card') {
      updateOnboardingData({ aadhaar: docUri } as any);
    } else {
      updateOnboardingData({ rationCard: docUri } as any);
    }
    router.push('/(onboarding)/bank');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AppText variant="h2" color={colors.text}>←</AppText>
          </TouchableOpacity>
          <AppText variant="h1" align="center" style={styles.headerTitle}>Verify your Identity</AppText>
          <AppText variant="body" align="center" color={colors.textSecondary}>Step 2 of 5</AppText>
        </View>

        <StepIndicator currentStep={2} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Image 
            source={require('../../../assets/images/image copy 5.png')}
            style={styles.illustration}
          />
          
          <AppText variant="h2" style={styles.sectionTitle}>Upload a valid document</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.sectionSubtitle}>
            This helps us verify your identity and keep your account Secure
          </AppText>

          <AppText variant="body" style={styles.label}>Choose Document Type</AppText>
          
          <TouchableOpacity 
            style={[styles.docTypeCard, docType === 'Aadhaar Card' && styles.docTypeCardActive]}
            onPress={() => setDocType('Aadhaar Card')}
          >
            <AppText variant="h3" color={colors.text}>🪪 Aadhaar Card</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.docTypeCard, docType === 'Ration Card' && styles.docTypeCardActive]}
            onPress={() => setDocType('Ration Card')}
          >
            <AppText variant="h3" color={colors.text}>🪪 Ration Card</AppText>
          </TouchableOpacity>

          <AppText variant="body" style={[styles.label, {marginTop: spacing.md}]}>Upload Document</AppText>
          
          <TouchableOpacity style={styles.uploadArea} onPress={handlePick}>
            {docUri ? (
              <Image source={{ uri: docUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <AppText variant="h2" style={{marginBottom: spacing.xs}}>☁️</AppText>
                <AppText variant="h3" color={colors.text}>Tap to Upload</AppText>
                <AppText variant="body" color={colors.textSecondary} align="center">JPG, PNG or PDF (Max. 5MB)</AppText>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Continue →" 
            onPress={handleContinue} 
            style={styles.continueButton}
            disabled={!docUri}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  container: { flex: 1 },
  header: { paddingTop: spacing.md, paddingHorizontal: spacing.xl },
  backButton: { position: 'absolute', left: spacing.xl, top: spacing.md, zIndex: 10 },
  headerTitle: { fontSize: 24 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  illustration: { width: '100%', height: width * 0.5, resizeMode: 'contain', marginVertical: spacing.lg },
  sectionTitle: { fontSize: 20, marginBottom: spacing.xs },
  sectionSubtitle: { marginBottom: spacing.xl },
  label: { marginBottom: spacing.sm, fontWeight: '600', color: colors.text },
  docTypeCard: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    padding: spacing.lg, 
    borderRadius: borderRadius.md, 
    marginBottom: spacing.sm 
  },
  docTypeCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '10' },
  uploadArea: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderStyle: 'dashed', 
    borderRadius: borderRadius.md, 
    height: 150, 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: { alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl * 2, paddingTop: spacing.md, backgroundColor: colors.surface },
  continueButton: { backgroundColor: '#74B686' },
});
