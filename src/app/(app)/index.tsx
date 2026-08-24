import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

// Assuming the device's IP for now as set in auth screens
import { BACKEND_URL } from '../../config/api.config';

export default function DashboardScreen() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalWeight: 0, eventsJoined: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch Wallet
      const walletRes = await fetch(`${BACKEND_URL}/wallet`, { headers });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWalletBalance(walletData.walletBalance || 0);
      }

      // Fetch Events
      const eventsRes = await fetch(`${BACKEND_URL}/events`, { headers });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      // Fetch Submissions
      const submissionsRes = await fetch(`${BACKEND_URL}/submissions/me`, { headers });
      if (submissionsRes.ok) {
        const submissions = await submissionsRes.json();
        let pending = 0, approved = 0, rejected = 0, totalWeight = 0;
        const uniqueEvents = new Set();
        
        submissions.forEach((sub: any) => {
          if (sub.status === 'PENDING') pending++;
          if (sub.status === 'APPROVED' || sub.status === 'PAID') {
            approved++;
            totalWeight += sub.weightKg;
          }
          if (sub.status === 'REJECTED') rejected++;
          uniqueEvents.add(sub.eventId);
        });
        
        setStats({ pending, approved, rejected, totalWeight, eventsJoined: uniqueEvents.size });
      }
    } catch (e) {
      console.log('Error fetching dashboard data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const upcomingEvent = events.length > 0 ? events[0] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="water" size={24} color={colors.primary} />
            </View>
            <View style={{ marginLeft: spacing.sm }}>
              <AppText variant="h2" color={colors.primary} style={{ lineHeight: 22 }}>SAARAL</AppText>
              <AppText variant="h2" color={colors.primaryDark} style={{ lineHeight: 22 }}>SALARY</AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={onRefresh} style={{ padding: 4, marginRight: spacing.sm }}>
              <Ionicons name="refresh-circle-outline" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.text} style={{ marginRight: spacing.md }} />
            <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
              <Image 
                source={user?.photoUrl ? { uri: user.photoUrl } : require('../../../assets/default-avatar.png')} 
                style={{ width: 38, height: 38, borderRadius: 19 }} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={{ flex: 1 }}>
            <AppText variant="h2" color={colors.text} style={{ marginBottom: 4 }}>
              Welcome, {user?.name || 'User'} 👋
            </AppText>
            <AppText variant="body" color={colors.textSecondary}>
              Let's keep our coast clean and earn rewards
            </AppText>
          </View>
        </View>

        {/* Wallet Card */}
        <View style={[styles.gradientCard, { backgroundColor: '#4ade80' }]}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={{ color: 'white', fontWeight: 'bold' }}>WALLET BALANCE</AppText>
            <AppText variant="h1" style={{ color: 'white', fontSize: 32, marginVertical: spacing.xs }}>
              ₹ {walletBalance.toFixed(2)}
            </AppText>
            <AppText variant="caption" style={{ color: 'white', marginBottom: spacing.md }}>Available Balance</AppText>
            
            <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/(app)/wallet')}>
              <AppText variant="caption" color={colors.primaryDark} style={{ fontWeight: '600' }}>View Wallet</AppText>
              <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Ionicons name="wallet" size={80} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
        </View>

        {/* Eco Coins Card */}
        <View style={[styles.gradientCard, { backgroundColor: '#166534', marginTop: spacing.md }]}>
          <Ionicons name="leaf" size={60} color="#facc15" style={{ marginRight: spacing.lg }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <AppText variant="body" style={{ color: 'white' }}>Your Eco Coins</AppText>
            <AppText variant="h1" style={{ color: 'white', fontSize: 40 }}>{Math.floor(walletBalance / 10)}</AppText>
            <AppText variant="body" style={{ color: 'white', marginBottom: spacing.sm }}>Eco Coins</AppText>
          </View>
          <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/(app)/wallet')}>
            <AppText variant="caption" color={colors.primaryDark} style={{ fontWeight: '600' }}>View Coins</AppText>
            <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View style={{ marginTop: spacing.xl }}>
          <AppText variant="h3" color={colors.text} style={{ marginBottom: spacing.md }}>Upcoming Events</AppText>
          
          <AppCard style={{ padding: 0, overflow: 'hidden' }}>
            {upcomingEvent ? (
              <View style={{ padding: spacing.md }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.eventImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={colors.border} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="location-outline" size={16} color={colors.primary} />
                      <AppText variant="caption" color={colors.text} style={{ marginLeft: 4 }}>
                        {upcomingEvent.title || 'Beach Cleanup'}
                      </AppText>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                      <AppText variant="caption" color={colors.text} style={{ marginLeft: 4 }}>
                        {new Date(upcomingEvent.dateTime).toLocaleDateString()} | {new Date(upcomingEvent.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </AppText>
                    </View>
                    <View style={[styles.eventDetailRow, { backgroundColor: '#eef2ff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }]}>
                      <Ionicons name="people-outline" size={16} color={colors.primaryDark} />
                      <AppText variant="caption" color={colors.primaryDark} style={{ marginLeft: 4 }}>Join Now</AppText>
                    </View>
                  </View>
                </View>
                
                <View style={styles.joiningBanner}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <View style={{ marginLeft: spacing.sm }}>
                    <AppText variant="body" color={colors.primaryDark} style={{ fontWeight: 'bold' }}>You're Joining</AppText>
                    <AppText variant="caption" color={colors.textSecondary}>Check-in the Event</AppText>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                  <TouchableOpacity 
                    style={[styles.eventButton, { backgroundColor: '#15803d' }]}
                    onPress={() => router.push(`/event/${upcomingEvent._id || upcomingEvent.id}`)}
                  >
                    <AppText variant="body" style={{ color: 'white' }}>View Details</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.eventButton, { backgroundColor: '#15803d' }]}>
                    <AppText variant="body" style={{ color: 'white' }}>Submit</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ padding: spacing.xl, alignItems: 'center' }}>
                <AppText variant="body" color={colors.textSecondary}>No upcoming events</AppText>
              </View>
            )}
          </AppCard>
        </View>

        {/* Recent Submission */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <AppText variant="h3" color={colors.text}>Recent Submission</AppText>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => router.push('/(app)/submissions?filter=ALL')}
            >
              <AppText variant="body" color={colors.primaryDark}>View All</AppText>
              <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SubmissionCard 
              type="Pending" 
              count={stats.pending} 
              color="#f59e0b" 
              icon="hourglass-outline" 
              onPress={() => router.push('/(app)/submissions?filter=PENDING')}
            />
            <SubmissionCard 
              type="Approved" 
              count={stats.approved} 
              color="#10b981" 
              icon="checkmark-outline" 
              onPress={() => router.push('/(app)/submissions?filter=APPROVED')}
            />
            <SubmissionCard 
              type="Rejected" 
              count={stats.rejected} 
              color="#ef4444" 
              icon="close-outline" 
              onPress={() => router.push('/(app)/submissions?filter=REJECTED')}
            />
          </View>
        </View>

        {/* Impact Matters */}
        <AppCard style={{ marginTop: spacing.xl, flexDirection: 'row', alignItems: 'center', padding: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <AppText variant="body" color={colors.primaryDark} style={{ fontWeight: 'bold' }}>Your Impact Matters!</AppText>
            <AppText variant="caption" color={colors.textSecondary} style={{ fontStyle: 'italic' }}>
              "Act Today. Create a Cleaner Tomorrow."
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: spacing.sm }}>
            <View style={{ alignItems: 'center', marginRight: spacing.sm }}>
              <Ionicons name="sync-circle-outline" size={24} color={colors.primary} />
              <AppText variant="body" color={colors.text} style={{ fontWeight: 'bold' }}>{stats.totalWeight.toFixed(1)} kg</AppText>
              <AppText variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>Waste</AppText>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="people-circle-outline" size={24} color="#3b82f6" />
              <AppText variant="body" color={colors.text} style={{ fontWeight: 'bold' }}>{stats.eventsJoined}</AppText>
              <AppText variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>Events</AppText>
            </View>
          </View>
        </AppCard>

      </ScrollView>
    </SafeAreaView>
  );
}

function SubmissionCard({ type, count, color, icon, onPress }: { type: string, count: number, color: string, icon: any, onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.subCard, { borderColor: color }]} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Ionicons name={icon} size={16} color={color} />
        <AppText variant="caption" style={{ color: color, marginLeft: 4, fontWeight: '600' }}>{type}</AppText>
      </View>
      <AppText variant="h2" color={colors.text}>{count}</AppText>
      <AppText variant="caption" color={colors.text} style={{ fontSize: 10, marginBottom: 8 }}>Submissions</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText variant="caption" style={{ color: color, fontSize: 10 }}>View Details</AppText>
        <Ionicons name="chevron-forward" size={10} color={color} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  logoPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  welcomeSection: { marginTop: spacing.xl, marginBottom: spacing.md, flexDirection: 'row' },
  gradientCard: { borderRadius: 20, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  viewButton: { backgroundColor: 'white', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  eventImagePlaceholder: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  eventDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  joiningBanner: { backgroundColor: '#f0fdf4', borderRadius: 8, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  eventButton: { flex: 1, paddingVertical: spacing.sm, borderRadius: 24, alignItems: 'center', marginHorizontal: 4 },
  subCard: { flex: 1, borderWidth: 1, borderRadius: 12, padding: spacing.sm, marginHorizontal: 4, alignItems: 'center', backgroundColor: 'white' },
});
