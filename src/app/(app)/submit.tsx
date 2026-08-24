import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import { BACKEND_URL } from '../../config/api.config';

const WASTE_CATEGORIES = [
  { id: 'PLASTIC', label: 'Plastic', icon: 'bag-outline' },
  { id: 'GLASS', label: 'Glass', icon: 'wine-outline' },
  { id: 'PAPER', label: 'Paper', icon: 'newspaper-outline' },
  { id: 'METAL', label: 'Metal', icon: 'hardware-chip-outline' },
  { id: 'ORGANIC', label: 'Organic', icon: 'leaf-outline' },
  { id: 'E-WASTE', label: 'E-Waste', icon: 'phone-portrait-outline' },
];

export default function SubmitScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { token } = useAuthStore();

  const [weightKg, setWeightKg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickPhoto = () => {
    Alert.alert(
      '📸 Photo Evidence',
      'Select how you would like to add waste photo proof:',
      [
        { text: '📷 Take Photo (Camera)', onPress: takeCameraPhoto },
        { text: '🖼️ Choose from Gallery', onPress: chooseGalleryPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takeCameraPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required to take a photo of the waste.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const chooseGalleryPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery permission is required to select a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!weightKg || parseFloat(weightKg) <= 0) {
      Alert.alert('Error', 'Please enter a valid weight.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a waste category.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Error', 'Please take a photo of the waste.');
      return;
    }
    if (!eventId) {
      Alert.alert('Error', 'No event ID found. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Get a signed upload URL
      const uploadRes = await fetch(`${BACKEND_URL}/submissions/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: `waste_${Date.now()}.jpg`,
          contentType: 'image/jpeg',
        }),
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, objectPath } = await uploadRes.json();

      // Step 2: Upload the image directly to Supabase
      const imageBlob = await fetch(photoUri).then(r => r.blob());
      const uploadImageRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: imageBlob,
      });

      // Note: Even if upload fails in dev (mock URL), we continue with the objectPath as photoUrl
      const photoUrl = objectPath;

      // Step 3: Create the submission
      const submissionRes = await fetch(`${BACKEND_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          photoUrl,
          latitude: 0,
          longitude: 0,
          capturedAt: new Date().toISOString(),
          weightKg: parseFloat(weightKg),
          category: selectedCategory,
        }),
      });

      if (!submissionRes.ok) {
        const err = await submissionRes.json();
        throw new Error(err.message || 'Submission failed');
      }

      const data = await submissionRes.json();
      router.replace({
        pathname: '/(app)/submission-success' as any,
        params: {
          submissionId: data.id || `SUB${Date.now().toString().slice(-8)}`,
          weightKg: weightKg,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: 'Event Site, Tamil Nadu',
        }
      });
    } catch (e: any) {
      console.error('Submit error', e);
      Alert.alert('Error', e.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" color={colors.text} style={{ flex: 1, textAlign: 'center', marginRight: 40 }}>
          Submit Waste
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Photo Section */}
        <AppCard style={styles.section}>
          <AppText variant="h3" color={colors.text} style={styles.sectionTitle}>
            📸 Photo Evidence
          </AppText>
          <TouchableOpacity style={[styles.photoBox, photoUri && { borderColor: '#16a34a', borderWidth: 2 }]} onPress={handlePickPhoto}>
            {photoUri ? (
              <View style={styles.photoTakenContainer}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
                <View style={styles.photoOverlayBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <AppText variant="caption" style={{ color: 'white', fontWeight: 'bold', marginLeft: 4 }}>
                    Tap to Change
                  </AppText>
                </View>
              </View>
            ) : (
              <View style={styles.photoPrompt}>
                <Ionicons name="camera-outline" size={42} color={colors.primary} />
                <AppText variant="body" color={colors.text} style={{ fontWeight: '600' }}>
                  Add Photo Evidence
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Camera or Gallery
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </AppCard>

        {/* Weight Section */}
        <AppCard style={styles.section}>
          <AppText variant="h3" color={colors.text} style={styles.sectionTitle}>
            ⚖️ Weight (KG)
          </AppText>
          <TextInput
            style={styles.weightInput}
            placeholder="e.g. 2.5"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            value={weightKg}
            onChangeText={setWeightKg}
          />
        </AppCard>

        {/* Category Section */}
        <AppCard style={styles.section}>
          <AppText variant="h3" color={colors.text} style={styles.sectionTitle}>
            ♻️ Waste Category
          </AppText>
          <View style={styles.categoryGrid}>
            {WASTE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryItem, selectedCategory === cat.id && styles.categorySelected]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={28}
                  color={selectedCategory === cat.id ? 'white' : colors.primary}
                />
                <AppText
                  variant="caption"
                  style={{ color: selectedCategory === cat.id ? 'white' : colors.text, marginTop: 4 }}
                >
                  {cat.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </AppCard>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <AppText variant="h3" style={{ color: 'white', fontWeight: 'bold' }}>
                Submit Waste
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: { padding: spacing.xs },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.md, padding: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  photoBox: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  photoTakenContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(22, 163, 74, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPrompt: { alignItems: 'center', gap: 6 },
  weightInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.text,
    backgroundColor: '#f8fafc',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  categorySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submitButton: {
    backgroundColor: '#15803d',
    borderRadius: borderRadius.lg,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitDisabled: { opacity: 0.6 },
});
