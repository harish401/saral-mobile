import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function RootIndex() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/language" />;
  }

  if (user && user.onboardingStatus === 'INCOMPLETE') {
    return <Redirect href="/(onboarding)/profile" />;
  }

  return <Redirect href="/(app)" />;
}
