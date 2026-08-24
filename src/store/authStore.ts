import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name?: string;
  phone: string;
  role: string;
  onboardingStatus: string;
  district?: string;
  village?: string;
  state?: string;
  photoUrl?: string;
  bankDetails?: any;
  dateOfBirth?: string;
  gender?: string;
  aadhaar?: string;
  rationCard?: string;
  documentVerificationStatus?: string;
  walletBalance?: number;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  onboardingData: Partial<User> | null;
  justRegistered: boolean;
  login: (user: User, token: string, isNewRegistration?: boolean) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateOnboardingData: (data: Partial<User>) => void;
  clearJustRegistered: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      onboardingData: null,
      justRegistered: false,

      login: (user, token, isNewRegistration = false) =>
        set({
      user,
      token,
      isAuthenticated: true,
      onboardingData: null,
      justRegistered: isNewRegistration,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      onboardingData: null,
      justRegistered: false,
    }),

  clearJustRegistered: () => set({ justRegistered: false }),

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  updateOnboardingData: (data) =>
    set((state) => ({
      onboardingData: state.onboardingData ? { ...state.onboardingData, ...data } : data,
    })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
