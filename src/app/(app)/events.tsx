import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import { BACKEND_URL } from '../../config/api.config';

export default function EventsScreen() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'My Events'>('Upcoming');
  
  const [locationName, setLocationName] = useState('Locating...');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchLocationAndEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLocationAndEvents(true);
    setRefreshing(false);
  };

  const fetchLocationAndEvents = async (isRefresh = false) => {
    try {
      if (!isRefresh) setIsLoading(true);
      setErrorMsg(null);
      let lat: number | undefined;
      let lng: number | undefined;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        lat = location.coords.latitude;
        lng = location.coords.longitude;
        
        // Reverse Geocoding
        const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          setLocationName(`${place.city || place.subregion || place.region}, ${place.region || place.country}`);
        } else {
          setLocationName('Unknown Location');
        }
      } else {
        setLocationName('Location Access Denied');
      }

      // Fetch Events
      let url = `${BACKEND_URL}/events`;
      if (lat !== undefined && lng !== undefined) {
        url += `?lat=${lat}&lng=${lng}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        const errText = await res.text();
        console.log('Failed to fetch events:', res.status, errText);
        setErrorMsg(`Failed to load: ${res.status}`);
      }
    } catch (e) {
      console.log('Error fetching events or location', e);
      setLocationName('Error fetching location');
      setErrorMsg('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const isJoined = e.participants && user && e.participants.includes(user.id);
    if (activeTab === 'Upcoming') return !isJoined;
    return isJoined;
  });

  const formatDistance = (meters?: number) => {
    if (meters === undefined) return '';
    if (meters < 1000) return `${meters}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h3" color={colors.text}>Nearby Events</AppText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="h1" color={colors.text} style={{ marginBottom: 4 }}>Events</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <AppText variant="body" color={colors.text} style={{ marginLeft: 4 }}>
              {locationName}
            </AppText>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <AppText 
            variant="body" 
            style={{ fontWeight: '600', color: activeTab === 'Upcoming' ? colors.primary : colors.textSecondary }}
          >
            Upcoming
          </AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'My Events' && styles.activeTab]}
          onPress={() => setActiveTab('My Events')}
        >
          <AppText 
            variant="body" 
            style={{ fontWeight: '600', color: activeTab === 'My Events' ? colors.primary : colors.textSecondary }}
          >
            My Events
          </AppText>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
        >
          {errorMsg ? (
            <View style={styles.centerContainer}>
              <AppText color="red">{errorMsg}</AppText>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.centerContainer}>
              <AppText color={colors.textSecondary}>No events found.</AppText>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <AppCard key={event.id || event._id} style={styles.eventCard}>
                <Image 
                  source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?q=80&w=600&auto=format&fit=crop' }}
                  style={styles.eventImage}
                />
                <View style={styles.eventInfo}>
                  <AppText variant="h3" color={colors.text} style={{ marginBottom: spacing.sm }}>
                    {event.title}
                  </AppText>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                    <AppText variant="caption" color={colors.text} style={styles.infoText}>
                      {new Date(event.dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </AppText>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color={colors.primary} />
                    <AppText variant="caption" color={colors.text} style={styles.infoText}>
                      {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </AppText>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color={colors.primary} />
                    <AppText variant="caption" color={colors.text} style={styles.infoText}>
                      {event.distanceMeters !== undefined ? formatDistance(event.distanceMeters) : 'Marina Beach, Chennai'}
                    </AppText>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={14} color={colors.primary} />
                    <AppText variant="caption" color={colors.text} style={styles.infoText}>
                      {event.participants?.length || 0}+ participants joined
                    </AppText>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.viewDetailsBtn}
                    onPress={() => router.push(`/(app)/event/${event.id || event._id}` as any)}
                  >
                    <AppText variant="bodySecondary" style={{ color: 'white', fontWeight: 'bold' }}>
                      View Details
                    </AppText>
                  </TouchableOpacity>
                </View>
              </AppCard>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backButton: { padding: spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  eventCard: { flexDirection: 'row', padding: spacing.sm, marginBottom: spacing.md, alignItems: 'center' },
  eventImage: { width: 120, height: 160, borderRadius: borderRadius.md, backgroundColor: '#f1f5f9' },
  eventInfo: { flex: 1, paddingLeft: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { marginLeft: 6, fontSize: 12 },
  viewDetailsBtn: { backgroundColor: '#15803d', paddingVertical: 8, borderRadius: borderRadius.sm, alignItems: 'center', marginTop: spacing.sm },
});
