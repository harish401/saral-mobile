import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

const BACKEND_URL = 'https://saaral-backend-489985112502.asia-south1.run.app'; // Match your backend URL

export default function PersonalDetailsScreen() {
  const { user, token, updateUser } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [state, setState] = useState(user?.state || '');
  const [village, setVillage] = useState(user?.village || '');
  const [loading, setLoading] = useState(false);

  const phone = user?.phone || '';

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { name, district, state, village };

      const response = await fetch(`${BACKEND_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser); // Update local store
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          {t('personalDetails.title', 'Personal Details')}
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={user?.photoUrl ? { uri: user.photoUrl } : require('../../../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera-outline" size={20} color="#059669" />
            <AppText style={styles.changePhotoText}>{t('personalDetails.changePhoto', 'Change Photo')}</AppText>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('personalDetails.name', 'Name')}</AppText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('personalDetails.mobile', 'Mobile no.')}</AppText>
              <AppText variant="h3" color={colors.text}>{phone}</AppText>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('personalDetails.district', 'District')}</AppText>
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="District"
                />
                <AppText variant="body" style={{ marginHorizontal: 8 }}>,</AppText>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={state}
                  onChangeText={setState}
                  placeholder="State"
                />
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="home-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('personalDetails.village', 'Village / Town')}</AppText>
              <TextInput
                style={styles.input}
                value={village}
                onChangeText={setVillage}
                placeholder="Village / Town"
              />
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginRight: 8 }} />
              <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>
                {t('personalDetails.save', 'Save Changes')}
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backButton: { padding: spacing.xs },
  headerTitle: { fontWeight: 'bold' },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: spacing.lg },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e2e8f0' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#15803d', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  changePhotoButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: '#059669' },
  changePhotoText: { color: '#059669', fontWeight: '600', marginLeft: 8 },
  infoContainer: { backgroundColor: 'white', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  iconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  infoTextContainer: { flex: 1, justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border },
  footer: { padding: spacing.lg, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#15803d', paddingVertical: spacing.md, borderRadius: 8 },
  input: { fontSize: 16, color: colors.text, padding: 0, paddingTop: 4, fontFamily: 'Inter-Regular' },
  rowInputs: { flexDirection: 'row', alignItems: 'center' }
});
