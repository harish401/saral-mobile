import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

export default function CheckinSuccessScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useLocalSearchParams<{
    eventId?: string;
    eventTitle?: string;
    date?: string;
    location?: string;
  }>();

  const title = params.eventTitle || 'Beach Cleanup Drive';
  const dateStr = params.date || '20 Aug 2026 (Tue)';
  const locationStr = params.location || 'Marina Beach, Chennai';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(app)/' as any)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          Confirm Check-in
        </AppText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Checkmark Icon */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={64} color="#15803d" />
          </View>
        </View>

        {/* Success Message */}
        <AppText variant="h1" style={styles.successTitle}>
          You have successfully checked-in!
        </AppText>

        {/* Event Info Card */}
        <AppCard style={styles.eventCard}>
          <View style={styles.cardRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=400' }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <AppText variant="h3" style={styles.eventTitle} numberOfLines={2}>
                {title}
              </AppText>

              <View style={styles.tagBadge}>
                <AppText variant="caption" style={{ color: '#15803d', fontWeight: 'bold' }}>
                  Events
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#15803d" />
            <AppText variant="bodySecondary" style={styles.detailText}>
              {dateStr}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#15803d" />
            <AppText variant="bodySecondary" style={styles.detailText}>
              07:00 AM - 10:00 AM
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#15803d" />
            <AppText variant="bodySecondary" style={styles.detailText}>
              {locationStr}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={18} color="#15803d" />
            <AppText variant="bodySecondary" style={styles.detailText}>
              120+ participants joined
            </AppText>
          </View>
        </AppCard>

        {/* Volunteer Info Card */}
        <View style={styles.volunteerCard}>
          <View style={styles.volunteerIconCircle}>
            <Ionicons name="person-outline" size={24} color="#15803d" />
          </View>
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <AppText variant="caption" style={{ color: '#15803d', fontWeight: 'bold' }}>
              Volunteer Name
            </AppText>
            <AppText variant="h3" style={{ color: colors.text, marginTop: 2 }}>
              {user?.name || 'Deepak Loganathan'}
            </AppText>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(app)/' as any)}
        >
          <AppText variant="h3" style={{ color: 'white', fontWeight: 'bold' }}>
            View Event Details
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    color: '#15803d',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    lineHeight: 32,
    paddingHorizontal: spacing.md,
  },
  eventCard: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
  },
  eventInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  tagBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  volunteerCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#dcfce7',
    marginBottom: spacing.xl,
  },
  volunteerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
