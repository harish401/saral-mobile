import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/theme';

export default function AppLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const hiddenScreenOptions = {
    href: null,
    headerShown: false,
    tabBarItemStyle: { display: 'none' as const },
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: (Platform.OS === 'ios' ? 56 : 58) + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 8,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home', 'Home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Events Tab */}
      <Tabs.Screen
        name="events"
        options={{
          title: t('tabs.events', 'Events'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Center Floating Submit Tab */}
      <Tabs.Screen
        name="submit"
        options={{
          title: t('tabs.submit', 'Submit'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.centerFab, focused && styles.centerFabActive]}>
              <Ionicons name="scan-outline" size={26} color="white" />
            </View>
          ),
          tabBarLabelStyle: styles.centerFabLabel,
        }}
      />

      {/* 4. Wallet Tab */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('tabs.wallet', 'Wallet'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile', 'Profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden Sub-screens (Completely hidden from Bottom Tab Bar) */}
      <Tabs.Screen name="settings" options={hiddenScreenOptions} />
      <Tabs.Screen name="personal-details" options={hiddenScreenOptions} />
      <Tabs.Screen name="bank-details" options={hiddenScreenOptions} />
      <Tabs.Screen name="language-settings" options={hiddenScreenOptions} />
      <Tabs.Screen name="submissions" options={hiddenScreenOptions} />
      <Tabs.Screen name="checkin-success" options={hiddenScreenOptions} />
      <Tabs.Screen name="submission-success" options={hiddenScreenOptions} />
      <Tabs.Screen name="terms" options={hiddenScreenOptions} />
      <Tabs.Screen name="event/[id]" options={hiddenScreenOptions} />
      <Tabs.Screen name="event/[id]/scan" options={hiddenScreenOptions} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  centerFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  centerFabActive: {
    backgroundColor: '#059669',
    transform: [{ scale: 1.05 }],
  },
  centerFabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 2,
  },
});
