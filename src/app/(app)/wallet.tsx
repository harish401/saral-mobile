import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

import { BACKEND_URL } from '../../config/api.config';

export default function WalletScreen() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch user profile for balance
      const userRes = await fetch(`${BACKEND_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setWalletBalance(userData.walletBalance || 0);
      }

      // Fetch submissions
      const subRes = await fetch(`${BACKEND_URL}/submissions/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        // Sort by capturedAt descending
        subData.sort((a: any, b: any) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
        setSubmissions(subData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED' || status === 'PAID') return '#dcfce7'; // green-100
    if (status === 'REJECTED') return '#fee2e2'; // red-100
    return '#fef9c3'; // yellow-100
  };

  const getStatusTextColor = (status: string) => {
    if (status === 'APPROVED' || status === 'PAID') return '#16a34a'; // green-600
    if (status === 'REJECTED') return '#dc2626'; // red-600
    return '#ca8a04'; // yellow-600
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h2" color={colors.text} style={{ flex: 1, textAlign: 'center', marginRight: 40 }}>
          Eco Coins Balance
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>Your Eco Coins</AppText>
              <AppText variant="h1" style={{ color: 'white', fontSize: 48, lineHeight: 56 }}>{walletBalance}</AppText>
              <AppText variant="body" style={{ color: 'white', fontWeight: 'bold' }}>Eco Coins</AppText>
            </View>
            <Ionicons name="cash-outline" size={80} color="#fbbf24" style={styles.coinIcon} />
          </View>

          <View style={styles.valueCard}>
            <AppText variant="body" style={{ color: '#15803d', fontWeight: '600', marginBottom: 4 }}>
              Total Value ( 1 Coin = ₹ 10 )
            </AppText>
            <AppText variant="h1" style={{ color: '#15803d', fontSize: 36 }}>
              ₹ {(walletBalance * 10).toFixed(2)}
            </AppText>
          </View>
        </View>

        <View style={styles.recentHeader}>
          <AppText variant="h3" color={colors.text}>Recent Coins Earned</AppText>
          <TouchableOpacity>
            <AppText variant="body" style={{ color: colors.textSecondary, fontWeight: '600' }}>View All</AppText>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ marginTop: 40 }}><ActivityIndicator size="large" color={colors.primary} /></View>
        ) : (
          <AppCard style={styles.listCard}>
            {submissions.map((sub, index) => (
              <View key={sub.id || index} style={[styles.transactionItem, index < submissions.length - 1 && styles.borderBottom]}>
                <View style={styles.coinBadge}>
                  <Ionicons name="leaf" size={24} color="#ca8a04" />
                </View>
                <View style={styles.transactionInfo}>
                  <AppText variant="h3" style={{ color: '#15803d' }}>
                    {sub.reward > 0 ? `+${sub.reward} Coins` : `${sub.reward} Coins`}
                  </AppText>
                  <AppText variant="caption" color={colors.text}>Submission Reward</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {new Date(sub.capturedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })},{' '}
                    {new Date(sub.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </AppText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sub.status) }]}>
                  <AppText variant="caption" style={{ color: getStatusTextColor(sub.status), fontWeight: 'bold' }}>
                    {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                  </AppText>
                </View>
              </View>
            ))}
            {submissions.length === 0 && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <AppText color={colors.textSecondary}>No recent submissions.</AppText>
              </View>
            )}
          </AppCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backButton: { padding: spacing.xs },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  
  balanceCard: {
    backgroundColor: '#22c55e', // green-500
    borderRadius: 24,
    padding: 24,
    marginBottom: spacing.xl,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  coinIcon: {
    backgroundColor: '#fef08a',
    borderRadius: 50,
    overflow: 'hidden',
  },
  valueCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  
  listCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  coinBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
