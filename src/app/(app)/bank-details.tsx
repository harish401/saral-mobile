import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../components/ui/AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

const BACKEND_URL = 'https://saaral-backend-489985112502.asia-south1.run.app';

export default function BankDetailsScreen() {
  const { user, token, updateUser } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const bankDetails = user?.bankDetails || {};
  const [accountHolderName, setAccountHolderName] = useState(bankDetails.accountHolderName || user?.name || '');
  const [accountNumber, setAccountNumber] = useState(bankDetails.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(bankDetails.ifscCode || '');
  const [upiId, setUpiId] = useState(bankDetails.upiId || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        bankDetails: {
          accountHolderName,
          accountNumber,
          ifscCode,
          upiId
        }
      };

      const response = await fetch(`${BACKEND_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to update bank details');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      Alert.alert('Success', 'Bank details updated successfully!');
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
          {t('bankDetails.title', 'Bank Details')}
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <AppText variant="h3" style={styles.sectionTitle}>
          {t('bankDetails.accountDetails', 'Account Details')}
        </AppText>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('bankDetails.holderName', 'Account Holder Name')}</AppText>
              <TextInput
                style={styles.input}
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                placeholder="Name as per bank"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="business-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('bankDetails.accountNumber', 'Account Number')}</AppText>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                keyboardType="number-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBoxTransparent} />
            <View style={styles.infoTextContainerRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="caption" color={colors.textSecondary}>{t('bankDetails.ifsc', 'IFSC Code')}</AppText>
                <TextInput
                  style={styles.input}
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  placeholder="e.g. SBIN0001234"
                  autoCapitalize="characters"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <TouchableOpacity>
                <AppText color={colors.primary} style={{ fontWeight: '600', marginLeft: 8 }}>
                  {t('bankDetails.findIfsc', 'Find IFSC')}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <AppText variant="h3" style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
          {t('bankDetails.upiDetails', 'UPI Details')}
        </AppText>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <AppText variant="caption" color={colors.textSecondary}>{t('bankDetails.upiId', 'UPI ID')}</AppText>
              <TextInput
                style={styles.input}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="e.g. 9876543210@ybl"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
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
                {t('bankDetails.save', 'Save Changes')}
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
  sectionTitle: { marginBottom: spacing.md },
  infoContainer: { backgroundColor: 'white', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  iconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  iconBoxTransparent: { width: 44, marginRight: spacing.md },
  infoTextContainer: { flex: 1, justifyContent: 'center' },
  infoTextContainerRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.border },
  footer: { padding: spacing.lg, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#15803d', paddingVertical: spacing.md, borderRadius: 8 },
  input: { fontSize: 16, color: colors.text, padding: 0, paddingTop: 4, fontFamily: 'Inter-Regular' }
});
