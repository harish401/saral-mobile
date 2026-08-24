import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../../theme/theme';
import { useAuthStore } from '../../../store/authStore';

import { BACKEND_URL } from '../../../config/api.config';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/events/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }
    } catch (e) {
      console.log('Error fetching event details', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    setIsJoining(true);
    try {
      const res = await fetch(`${BACKEND_URL}/events/${id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedEvent = await res.json();
        setEvent(updatedEvent);
        Alert.alert('Success', 'You have joined the event!');
      } else {
        Alert.alert('Error', 'Could not join event.');
      }
    } catch (e) {
      console.log('Error joining event', e);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText>Event not found</AppText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <AppText color={colors.primary}>Go Back</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const isJoined = event.participants && user && event.participants.includes(user.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Image 
          source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?q=80&w=600&auto=format&fit=crop' }}
          style={styles.heroImage}
        />
        
        <View style={styles.cardContainer}>
          <View style={styles.badge}>
            <AppText variant="caption" color={colors.primary} style={{ fontWeight: '600' }}>Event</AppText>
          </View>

          <AppText variant="h1" color={colors.text} style={styles.title}>
            {event.title}
          </AppText>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <AppText variant="body" color={colors.text} style={styles.infoText}>
              {new Date(event.dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ({new Date(event.dateTime).toLocaleDateString('en-US', { weekday: 'short' })})
              {' '} {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </AppText>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <AppText variant="body" color={colors.text} style={styles.infoText}>
              Marina Beach, Chennai
            </AppText>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={colors.primary} />
            <AppText variant="body" color={colors.text} style={styles.infoText}>
              {event.participants?.length || 0}+ participants joined
            </AppText>
          </View>

          <View style={styles.divider} />

          <AppText variant="h3" color={colors.text} style={{ marginBottom: spacing.sm }}>
            About this event
          </AppText>
          <AppText variant="body" color={colors.text} style={{ lineHeight: 22, marginBottom: spacing.md }}>
            {event.description || 'Join us to keep Marina Beach clean and make our coast beautiful. Your actions make a big difference!'}
          </AppText>

          <View style={styles.divider} />

          <AppText variant="h3" color={colors.text} style={{ marginBottom: spacing.sm }}>
            What to bring
          </AppText>
          <AppText variant="body" color={colors.text} style={{ lineHeight: 22 }}>
            {event.whatToBring || 'Gloves, Water Bottle, Cap\n(We will provide trash bags)'}
          </AppText>
        </View>

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {isJoined ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
              style={[styles.primaryButton, { flex: 1 }]}
              onPress={() => router.push(`/(app)/event/${event.id}/scan` as any)}
            >
              <Ionicons name="qr-code-outline" size={18} color="white" style={{ marginRight: 6 }} />
              <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>Check In</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={() => router.push({ pathname: '/(app)/submit', params: { eventId: event.id || event._id } } as any)}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#15803d" style={{ marginRight: 6 }} />
              <AppText variant="body" style={{ color: '#15803d', fontWeight: 'bold' }}>Submit Waste</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleJoinEvent}
            disabled={isJoining}
          >
            {isJoining ? (
               <ActivityIndicator color="white" />
            ) : (
               <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>Join Event</AppText>
            )}
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backButton: { padding: spacing.xs },
  scrollContent: { paddingBottom: spacing.xxl },
  heroImage: { width: '100%', height: 350, backgroundColor: '#f1f5f9', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginTop: -60, zIndex: -1 },
  cardContainer: { backgroundColor: 'white', borderRadius: 24, marginHorizontal: spacing.md, marginTop: -40, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  badge: { backgroundColor: '#e2e8f0', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: spacing.sm },
  title: { marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  infoText: { marginLeft: 8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  bottomActions: { padding: spacing.lg, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border },
  primaryButton: { backgroundColor: '#15803d', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  secondaryButton: { backgroundColor: 'white', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderWidth: 2, borderColor: '#15803d' },
});
