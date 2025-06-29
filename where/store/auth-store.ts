import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { useReferralStore } from './referral-store';

interface AuthState {
  user: User | null;
  users: User[]; // Store all users for referral system
  isAuthenticated: boolean;
  isAnonymous: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, referralCode?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFarcaster: () => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
  addPoints: (points: number) => void;
  getAllUsers: () => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      isAnonymous: false,

      login: async (username, password) => {
        // In a real app, this would make an API call
        // For now, we'll simulate a successful login
        const userId = `user_${Date.now()}`;
        const newUser = {
          id: userId,
          username,
          isAnonymous: false,
          points: 0,
          authProvider: 'email' as const,
        };
        
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        
        // Generate referral code for the user
        useReferralStore.getState().generateReferralCode(userId);
        
        return true;
      },

      signup: async (username, password, referralCode) => {
        // In a real app, this would make an API call
        // For now, we'll simulate a successful signup
        const userId = `user_${Date.now()}`;
        const newUser = {
          id: userId,
          username,
          isAnonymous: false,
          points: 0,
          authProvider: 'email' as const,
        };
        
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        
        // Generate referral code for the user
        useReferralStore.getState().generateReferralCode(userId);
        
        // Process referral if provided
        if (referralCode) {
          useReferralStore.getState().claimReferral(referralCode, userId);
        }
        
        return true;
      },

      loginWithGoogle: async () => {
        // In a real app, this would use Google OAuth
        // For now, we'll simulate a successful login
        const userId = `google_${Date.now()}`;
        const newUser = {
          id: userId,
          username: "Google User",
          isAnonymous: false,
          points: 0,
          authProvider: 'google' as const,
          profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        };
        
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        
        // Generate referral code for the user
        useReferralStore.getState().generateReferralCode(userId);
        
        return true;
      },

      loginWithFarcaster: async () => {
        // In a real app, this would use Farcaster authentication
        // For now, we'll simulate a successful login
        const userId = `farcaster_${Date.now()}`;
        const newUser = {
          id: userId,
          username: "Farcaster User",
          isAnonymous: false,
          points: 0,
          authProvider: 'farcaster' as const,
          profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        };
        
        set(state => ({
          user: newUser,
          users: [...state.users, newUser],
          isAuthenticated: true,
          isAnonymous: false,
        }));
        
        // Generate referral code for the user
        useReferralStore.getState().generateReferralCode(userId);
        
        return true;
      },

      continueAsGuest: () => {
        const userId = `anonymous_${Date.now()}`;
        const guestUser = {
          id: userId,
          username: null,
          isAnonymous: true,
          points: 0,
          authProvider: 'guest' as const,
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
        });
      },

      addPoints: (points) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              points: user.points + points,
            }
          });
          
          // Also update in the users array
          set(state => ({
            users: state.users.map(u => 
              u.id === user.id ? { ...u, points: u.points + points } : u
            )
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
    }
  )
);
