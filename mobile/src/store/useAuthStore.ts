import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'currycraft_auth_token';
const USER_PROFILE_KEY = 'currycraft_user_profile';

export interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAddress: (address: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    try {
      let token: string | null = null;
      let userStr: string | null = null;

      if (Platform.OS !== 'web') {
        token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        userStr = await SecureStore.getItemAsync(USER_PROFILE_KEY);
      }

      if (token && userStr) {
        const user = JSON.parse(userStr) as UserProfile;
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        // Provide default guest profile with sample Indian address
        const guestUser: UserProfile = {
          name: 'Shreyam Mukherjee',
          phone: '9876543210',
          email: 'shreyam@example.com',
          addresses: ['12 Park Street, Heritage Quarter, Kolkata - 700016']
        };
        set({ token: 'guest-session-token', user: guestUser, isAuthenticated: true, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  loginWithPhone: async (phone: string, name = 'Gourmet Patron') => {
    const user: UserProfile = {
      name,
      phone,
      addresses: ['12 Park Street, Heritage Quarter, Kolkata - 700016']
    };
    const token = `jwt_session_${Date.now()}_${phone}`;

    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(user));
    }

    set({ token, user, isAuthenticated: true });
    return true;
  },

  logout: async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  addAddress: async (address: string) => {
    const state = get();
    if (!state.user) return;

    const updatedUser: UserProfile = {
      ...state.user,
      addresses: [address, ...state.user.addresses]
    };

    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(updatedUser));
    }

    set({ user: updatedUser });
  }
}));
