import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './auth-store';
import { usePointsStore } from './points-store';

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  createdAt: number;
  claimed: boolean;
}

interface ReferralState {
  referrals: Referral[];
  userReferralCode: string | null;
  
  // Actions
  generateReferralCode: (userId: string) => string;
  getReferralCode: (userId: string) => string | null;
  claimReferral: (code: string, newUserId: string) => boolean;
  getUserReferrals: (userId: string) => Referral[];
  getReferralCount: (userId: string) => number;
}

// Generate a random referral code
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      userReferralCode: null,
      
      generateReferralCode: (userId) => {
        // Check if user already has a code
        const existingCode = get().getReferralCode(userId);
        if (existingCode) return existingCode;
        
        // Generate a new unique code
        const code = `WHERE-${generateRandomCode()}`;
        
        set((state) => ({
          userReferralCode: code,
        }));
        
        return code;
      },
      
      getReferralCode: (userId) => {
        return get().userReferralCode;
      },
      
      claimReferral: (code, newUserId) => {
        // Check if code exists and is valid
        const { referrals } = get();
        const referral = referrals.find(r => r.code === code);
        
        // If referral doesn't exist, create a new one
        if (!referral) {
          // Find the user who owns this code
          const allUsers = useAuthStore.getState().getAllUsers();
          const referrer = allUsers.find(user => get().getReferralCode(user.id) === code);
          
          if (!referrer) return false;
          
          // Create new referral
          const newReferral: Referral = {
            id: `ref_${Date.now()}`,
            referrerId: referrer.id,
            referredId: newUserId,
            code,
            createdAt: Date.now(),
            claimed: true,
          };
          
          set((state) => ({
            referrals: [...state.referrals, newReferral],
          }));
          
          // Award points to referrer (5 points)
          usePointsStore.getState().addPoints(
            referrer.id,
            'system',
            'referral',
            5.0
          );
          
          return true;
        }
        
        return false;
      },
      
      getUserReferrals: (userId) => {
        return get().referrals.filter(r => r.referrerId === userId);
      },
      
      getReferralCount: (userId) => {
        return get().referrals.filter(r => r.referrerId === userId && r.claimed).length;
      },
    }),
    {
      name: 'where-referral-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
