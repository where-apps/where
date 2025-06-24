import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointActivity } from '@/types';
import { useAuthStore } from './auth-store';
import { Location, Contributor } from '@/types';

interface PointsState {
  activities: PointActivity[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addPoints: (userId: string, locationId: string, activityType: PointActivity['activityType'], points: number) => void;
  distributeEngagementPoints: (locationId: string, points: number) => void;
  getUserPoints: (userId: string) => number;
  getUserActivities: (userId: string) => PointActivity[];
  likeImage: (userId: string, locationId: string, imageUrl: string) => void;
  unlikeImage: (userId: string, locationId: string, imageUrl: string) => void;
  isImageLikedByUser: (userId: string, imageUrl: string) => boolean;
  getImageLikes: (imageUrl: string) => number;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      activities: [],
      isLoading: false,
      error: null,

      addPoints: (userId, locationId, activityType, points) => {
        const newActivity: PointActivity = {
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          locationId,
          activityType,
          points,
          createdAt: Date.now(),
          metadata: {},
        };

        set(state => ({
          activities: [...state.activities, newActivity],
        }));

        // Update user's points in auth store
        if (userId === useAuthStore.getState().user?.id) {
          useAuthStore.getState().addPoints(points);
        }
      },

      distributeEngagementPoints: (locationId, totalPoints) => {
        const { locations } = require('./locations-store').useLocationsStore.getState();
        const location = locations.find((loc: Location) => loc.id === locationId);
        
        if (!location) return;
        
        // Creator gets 30% of points
        const creatorPoints = totalPoints * 0.3;
        const remainingPoints = totalPoints * 0.7;
        
        // Add points to creator
        if (location.createdBy) {
          const newActivity: PointActivity = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: location.createdBy,
            locationId,
            activityType: 'receive_engagement',
            points: creatorPoints,
            createdAt: Date.now(),
            metadata: {},
          };

          set(state => ({
            activities: [...state.activities, newActivity],
          }));
          
          // Update user's points if it's the current user
          if (location.createdBy === useAuthStore.getState().user?.id) {
            useAuthStore.getState().addPoints(creatorPoints);
          }
        }
        
        // Distribute remaining points among contributors
        const contributors = location.contributors.filter((c: Contributor) => c.userId !== location.createdBy);
        if (contributors.length > 0) {
          const pointsPerContributor = remainingPoints / contributors.length;
          
          contributors.forEach((contributor: Contributor) => {
            const newActivity: PointActivity = {
              id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId: contributor.userId,
              locationId,
              activityType: 'receive_engagement',
              points: pointsPerContributor,
              createdAt: Date.now(),
              metadata: {},
            };

            set(state => ({
              activities: [...state.activities, newActivity],
            }));
            
            // Update user's points if it's the current user
            if (contributor.userId === useAuthStore.getState().user?.id) {
              useAuthStore.getState().addPoints(pointsPerContributor);
            }
          });
        }
      },

      getUserPoints: (userId) => {
        const { activities } = get();
        return activities
          .filter(activity => activity.userId === userId)
          .reduce((total, activity) => total + activity.points, 0);
      },

      getUserActivities: (userId) => {
        const { activities } = get();
        return activities.filter(activity => activity.userId === userId);
      },
      
      likeImage: (userId, locationId, imageUrl) => {
        // Check if user already liked this image
        const { activities } = get();
        const existingLike = activities.find(
          a => a.userId === userId && 
               a.activityType === 'like_image' && 
               a.metadata?.imageUrl === imageUrl
        );
        
        if (existingLike) return; // Already liked
        
        // Add like activity
        const newActivity: PointActivity = {
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          locationId,
          activityType: 'like_image',
          points: 0, // User doesn't get points for liking
          createdAt: Date.now(),
          metadata: { imageUrl },
        };
        
        set(state => ({
          activities: [...state.activities, newActivity],
        }));
        
        // Distribute points to image contributor (0.1 points per like)
        get().distributeEngagementPoints(locationId, 0.1);
      },
      
      unlikeImage: (userId, locationId, imageUrl) => {
        set(state => ({
          activities: state.activities.filter(
            a => !(a.userId === userId && 
                 a.activityType === 'like_image' && 
                 a.metadata?.imageUrl === imageUrl)
          ),
        }));
        
        // Note: We don't remove the distributed points
      },
      
      isImageLikedByUser: (userId, imageUrl) => {
        const { activities } = get();
        return activities.some(
          a => a.userId === userId && 
               a.activityType === 'like_image' && 
               a.metadata?.imageUrl === imageUrl
        );
      },
      
      getImageLikes: (imageUrl) => {
        const { activities } = get();
        return activities.filter(
          a => a.activityType === 'like_image' && 
               a.metadata?.imageUrl === imageUrl
        ).length;
      },
    }),
    {
      name: 'where-points-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
