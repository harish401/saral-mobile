import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import { BACKEND_URL } from '../../config/api.config';

type FilterType = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function RecentSubmissionsScreen() {
  const { filter: initialFilter } = useLocalSearchParams<{ filter?: string }>();
  const router = useRouter();
  const { token } = useAuthStore();

  const [activeTab, setActiveTab] = useState<FilterType>(
    (initialFilter?.toUpperCase() as FilterType) || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Submissions
      const subRes = await fetch(`${BACKEND_URL}/submissions/me`, { headers });
      if (subRes.ok) {
        const data = await subRes.json();
        setSubmissions(data);
      }

      // Fetch Events for Titles & Addresses
      const eventRes = await fetch(`${BACKEND_URL}/events`, { headers });
      if (eventRes.ok) {
        const eventsData = await eventRes.json();
        const map: Record<string, any> = {};
        eventsData.forEach((e: any) => {
          map[e.id || e._id] = e;
        });
        setEventsMap(map);
      }
    } catch (e) {
      console.log('Error fetching submissions list', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const status = sub.status || 'PENDING';
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && status === 'PENDING') ||
      (activeTab === 'APPROVED' && (status === 'APPROVED' || status === 'PAID')) ||
      (activeTab === 'REJECTED' && status === 'REJECTED');

    const event = eventsMap[sub.eventId];
    const eventTitle = event?.title || 'Cleanup Event';
    const category = sub.category || '';
    const matchesSearch =
      searchQuery.trim() === '' ||
      eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" style={styles.headerTitle}>
          Recent Submissions
        </AppText>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs Bar */}
      <View style={styles.tabsContainer}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterType[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase();
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.activeTabItem]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText
                variant="bodySecondary"
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by event or category..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Submissions List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : filteredSubmissions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={56} color={colors.textLight} />
            <AppText variant="body" color={colors.textSecondary} style={{ marginTop: 12 }}>
              No submissions found for this filter.
            </AppText>
          </View>
        ) : (
          filteredSubmissions.map((item) => {
            const event = eventsMap[item.eventId];
            const title = event?.title || `${item.category || 'Waste'} Collection`;
            const address = event?.location?.address || event?.description || 'Cleanup Location';
            const dateStr = item.capturedAt || item.createdAt || new Date().toISOString();
            const formattedDate = new Date(dateStr).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const formattedTime = new Date(dateStr).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isApproved = item.status === 'APPROVED' || item.status === 'PAID';
            const isRejected = item.status === 'REJECTED';

            const statusBg = isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7';
            const statusColor = isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#b45309';
            const statusText = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';

            const imageUri = item.photoUrl
              ? (item.photoUrl.startsWith('http')
                  ? item.photoUrl
                  : `https://bjqtmtozzucjtllnzenj.supabase.co/storage/v1/object/public/saaral-salary-uploads/${item.photoUrl}`)
              : null;

            return (
              <AppCard key={item.id || item._id} style={styles.card}>
                <View style={styles.cardRow}>
                  {/* Left Image Thumbnail */}
                  <View style={styles.imageContainer}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.cardImage} />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Ionicons name="leaf-outline" size={32} color={colors.primary} />
                      </View>
                    )}
                  </View>

                  {/* Middle Info */}
                  <View style={styles.infoContainer}>
                    <View style={styles.topMeta}>
                      <AppText variant="caption" color={colors.textSecondary}>
                        {formattedDate}, {formattedTime}
                      </AppText>
                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <AppText variant="caption" style={{ color: statusColor, fontWeight: 'bold' }}>
                          {statusText}
                        </AppText>
                      </View>
                    </View>

                    <AppText variant="h3" color={colors.text} numberOfLines={1} style={styles.cardTitle}>
                      {title}
                    </AppText>

                    <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                      {address}
                    </AppText>

                    <View style={styles.bottomMeta}>
                      <AppText variant="bodySecondary" style={{ fontWeight: '600', color: colors.text }}>
                        Weight: {item.weightKg} kg
                      </AppText>
                      {item.reward > 0 ? (
                        <AppText variant="caption" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                          + {item.reward} Coins (₹{item.reward * 10})
                        </AppText>
                      ) : null}
                    </View>
                  </View>

                  {/* Right Arrow */}
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} style={{ alignSelf: 'center' }} />
                </View>
              </AppCard>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
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
  refreshButton: { padding: spacing.xs },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.xs,
    justifyContent: 'space-between',
    height: 90,
  },
  topMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
});
