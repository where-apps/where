import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { User } from '@/types';
import { useReferralStore } from './referral-store';

const SUPABASE_URL = 'https://otbvkfzpcxzrcikwysrk.supabase.co' as const;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnZrZnpwY3h6cmNpa3d5c3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzE5MTIsImV4cCI6MjA3NDgwNzkxMn0.hdwZ78DuB3Zm92SuEOG-HTh5Lbn-xB5WjLV6Xqcs1SM' as const;

export type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  provider_token?: string;
};

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAnonymous: boolean;
  supabaseSession: SupabaseSession | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, referralCode?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFarcaster: () => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
  addPoints: (points: number) => void;
  getAllUsers: () => User[];
}

async function fetchSupabaseUser(session: SupabaseSession): Promise<User | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    if (!res.ok) {
      console.log('fetchSupabaseUser error', res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
    const user: User = {
      id: data.id,
      username: (data.user_metadata?.name as string | undefined) ?? (data.email ?? null),
      isAnonymous: false,
      points: 0,
      authProvider: 'google',
      profileImage: (data.user_metadata?.avatar_url as string | undefined) ?? null,
    };
    return user;
  } catch (e) {
    console.log('fetchSupabaseUser exception', e);
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      isAnonymous: false,
      supabaseSession: null,

      login: async (username, password) => {
        const userId = `user_${Date.now()}`;
        const newUser: User = {
          id: userId,
          username,
          isAnonymous: false,
          points: 0,
          authProvider: 'email',
        };
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        useReferralStore.getState().generateReferralCode(userId);
        return true;
      },

      signup: async (username, password, referralCode) => {
        const userId = `user_${Date.now()}`;
        const newUser: User = {
          id: userId,
          username,
          isAnonymous: false,
          points: 0,
          authProvider: 'email',
        };
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        useReferralStore.getState().generateReferralCode(userId);
        if (referralCode) {
          useReferralStore.getState().claimReferral(referralCode, userId);
        }
        return true;
      },

      loginWithGoogle: async () => {
        try {
          const redirectUri = Linking.createURL('/auth/callback');
          const params = new URLSearchParams({
            provider: 'google',
            redirect_to: redirectUri,
            // Using implicit flow to get tokens back in fragment
            // goTrue supports this on authorize endpoint
            response_type: 'token',
            prompt: 'select_account',
          });
          const authorizeUrl = `${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;
          const result = await WebBrowser.openAuthSessionAsync(authorizeUrl, redirectUri);
          if (result.type !== 'success' || !result.url) {
            console.log('Google auth cancelled or failed', result.type);
            return false;
          }
          const url = result.url;
          const fragment = url.split('#')[1] ?? '';
          const sp = new URLSearchParams(fragment);
          const access_token = sp.get('access_token') ?? '';
          const refresh_token = sp.get('refresh_token') ?? '';
          if (!access_token) {
            console.log('No access_token in redirect');
            return false;
          }
          const session: SupabaseSession = {
            access_token,
            refresh_token: refresh_token || undefined,
            token_type: sp.get('token_type') ?? undefined,
            expires_in: sp.get('expires_in') ? Number(sp.get('expires_in')) : undefined,
            provider_token: sp.get('provider_token') ?? undefined,
          };
          const fetchedUser = await fetchSupabaseUser(session);
          if (!fetchedUser) return false;

          set(state => ({
            supabaseSession: session,
            user: fetchedUser,
            users: [...state.users, fetchedUser],
            isAuthenticated: true,
            isAnonymous: false,
          }));
          useReferralStore.getState().generateReferralCode(fetchedUser.id);
          return true;
        } catch (e) {
          console.log('loginWithGoogle error', e);
          return false;
        }
      },

      loginWithFarcaster: async () => {
        const userId = `farcaster_${Date.now()}`;
        const newUser: User = {
          id: userId,
          username: 'Farcaster User',
          isAnonymous: false,
          points: 0,
          authProvider: 'farcaster',
          profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        };
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        useReferralStore.getState().generateReferralCode(userId);
        return true;
      },

      continueAsGuest: () => {
        const userId = `anonymous_${Date.now()}`;
        const guestUser: User = {
          id: userId,
          username: null,
          isAnonymous: true,
          points: 0,
          authProvider: 'guest',
        };
        set({
          user: guestUser,
          isAuthenticated: false,
          isAnonymous: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAnonymous: false,
          supabaseSession: null,
        });
      },

      addPoints: (points) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              points: user.points + points,
            },
          });
          set(state => ({
            users: state.users.map(u => (u.id === user.id ? { ...u, points: u.points + points } : u)),
          }));
        }
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: 'where-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAnonymous: state.isAnonymous,
        supabaseSession: state.supabaseSession,
        users: state.users,
      }),
    }
  )
);
