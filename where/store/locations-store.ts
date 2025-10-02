import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, Rating, Comment, Contributor } from '@/types';
import { useAuthStore } from './auth-store';
import { usePointsStore } from './points-store';

interface LocationsState {
  locations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<Location | null>;
  selectLocation: (location: Location | null) => void;
  addLocation: (location: Partial<Location>) => Promise<Location>;
  addComment: (locationId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  rateLocation: (locationId: string, ratings: Rating) => Promise<void>;
  verifyLocation: (locationId: string) => Promise<void>;
  addImageToLocation: (locationId: string, imageUrl: string) => Promise<void>;
  removeImageFromLocation: (locationId: string, imageUrl: string) => Promise<void>;
}

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: null,
      isLoading: false,
      error: null,

      fetchLocations: async () => {
        set({ isLoading: true, error: null });
        try {
          set({ locations: [], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch locations', isLoading: false });
        }
      },

      fetchLocationById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll search in our mock data
          const location = get().locations.find(loc => loc.id === id) || null;
          set({ selectedLocation: location, isLoading: false });
          return location;
        } catch (error) {
          set({ error: 'Failed to fetch location', isLoading: false });
          return null;
        }
      },

      selectLocation: (location) => {
        set({ selectedLocation: location });
      },

      addLocation: async (locationData) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll create a new location locally
          const user = useAuthStore.getState().user;
          const newLocation: Location = {
            id: `loc_${Date.now()}`,
            name: locationData.name || 'Unnamed Location',
            description: locationData.description || '',
            latitude: locationData.latitude || 0,
            longitude: locationData.longitude || 0,
            images: locationData.images || [],
            allImages: locationData.images || [],
            ratings: locationData.ratings || {
              security: 0,
              violence: 0,
              welcoming: 0,
              streetFood: 0,
              restaurants: 0,
              pickpocketing: 0,
              qualityOfLife: 0,
              hookers: 0,
            },
            ratingCount: 0,
            comments: [],
            createdBy: locationData.createdBy || (user ? user.id : 'anonymous'),
            createdAt: Date.now(),
            verified: false,
            verificationCount: 0,
            contributors: [{
              userId: locationData.createdBy || (user ? user.id : 'anonymous'),
              username: user?.username || null,
              isAnonymous: user ? user.isAnonymous : true,
              contribution: 'image',
              createdAt: Date.now(),
            }],
          };

          const updatedLocations = [...get().locations, newLocation];
          set({ locations: updatedLocations, isLoading: false });
          
          // Award points to the creator
          if (user) {
            usePointsStore.getState().addPoints(
              user.id,
              newLocation.id,
              'create_location',
              1.0
            );
          }
          
          return newLocation;
        } catch (error) {
          set({ error: 'Failed to add location', isLoading: false });
          throw error;
        }
      },

      addComment: async (locationId, commentData) => {
        set({ isLoading: true, error: null });
        try {
          const { locations } = get();
          const locationIndex = locations.findIndex(loc => loc.id === locationId);
          
          if (locationIndex === -1) {
            throw new Error('Location not found');
          }

          const newComment: Comment = {
            id: `comment_${Date.now()}`,
            userId: commentData.userId,
            username: commentData.username,
            isAnonymous: commentData.isAnonymous,
            text: commentData.text,
            createdAt: Date.now(),
          };

          // Add contributor if not already a contributor
          let updatedContributors = [...locations[locationIndex].contributors];
          if (!updatedContributors.some(c => c.userId === commentData.userId && c.contribution === 'comment')) {
            updatedContributors.push({
              userId: commentData.userId,
              username: commentData.username,
              isAnonymous: commentData.isAnonymous,
              contribution: 'comment',
              createdAt: Date.now(),
            });
          }

          const updatedLocation = {
            ...locations[locationIndex],
            comments: [...locations[locationIndex].comments, newComment],
            contributors: updatedContributors,
          };

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
          
          // Award points for commenting
          usePointsStore.getState().addPoints(
            commentData.userId,
            locationId,
            'comment',
            0.1
          );
          
          // Distribute engagement points
          usePointsStore.getState().distributeEngagementPoints(locationId, 0.1);
        } catch (error) {
          set({ error: 'Failed to add comment', isLoading: false });
        }
      },

      rateLocation: async (locationId, newRatings) => {
        set({ isLoading: true, error: null });
        try {
          const { locations } = get();
          const locationIndex = locations.findIndex(loc => loc.id === locationId);
          
          if (locationIndex === -1) {
            throw new Error('Location not found');
          }

          const location = locations[locationIndex];
          const currentRatings = location.ratings;
          const currentCount = location.ratingCount;

          // Calculate new average ratings
          const updatedRatings: Rating = {
            security: ((currentRatings.security * currentCount) + newRatings.security) / (currentCount + 1),
            violence: ((currentRatings.violence * currentCount) + newRatings.violence) / (currentCount + 1),
            welcoming: ((currentRatings.welcoming * currentCount) + newRatings.welcoming) / (currentCount + 1),
            streetFood: ((currentRatings.streetFood * currentCount) + newRatings.streetFood) / (currentCount + 1),
            restaurants: ((currentRatings.restaurants * currentCount) + newRatings.restaurants) / (currentCount + 1),
            pickpocketing: ((currentRatings.pickpocketing * currentCount) + newRatings.pickpocketing) / (currentCount + 1),
            qualityOfLife: ((currentRatings.qualityOfLife * currentCount) + newRatings.qualityOfLife) / (currentCount + 1),
            hookers: ((currentRatings.hookers * currentCount) + newRatings.hookers) / (currentCount + 1),
          };

          // Add contributor if not already a contributor
          let updatedContributors = [...location.contributors];
          const user = useAuthStore.getState().user;
          const userId = user ? user.id : 'anonymous';
          
          if (!updatedContributors.some(c => c.userId === userId && c.contribution === 'rating')) {
            updatedContributors.push({
              userId,
              username: user?.username || null,
              isAnonymous: user ? user.isAnonymous : true,
              contribution: 'rating',
              createdAt: Date.now(),
            });
          }

          const updatedLocation = {
            ...location,
            ratings: updatedRatings,
            ratingCount: currentCount + 1,
            contributors: updatedContributors,
          };

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
          
          // Award points for rating
          if (user) {
            usePointsStore.getState().addPoints(
              user.id,
              locationId,
              'rate_location',
              0.1
            );
          }
          
          // Distribute engagement points
          usePointsStore.getState().distributeEngagementPoints(locationId, 0.1);
        } catch (error) {
          set({ error: 'Failed to rate location', isLoading: false });
        }
      },

      verifyLocation: async (locationId) => {
        set({ isLoading: true, error: null });
        try {
          const { locations } = get();
          const locationIndex = locations.findIndex(loc => loc.id === locationId);
          
          if (locationIndex === -1) {
            throw new Error('Location not found');
          }

          const location = locations[locationIndex];
          
          // Add contributor if not already a contributor
          let updatedContributors = [...location.contributors];
          const user = useAuthStore.getState().user;
          const userId = user ? user.id : 'anonymous';
          
          if (!updatedContributors.some(c => c.userId === userId && c.contribution === 'verification')) {
            updatedContributors.push({
              userId,
              username: user?.username || null,
              isAnonymous: user ? user.isAnonymous : true,
              contribution: 'verification',
              createdAt: Date.now(),
            });
          }

          const updatedLocation = {
            ...location,
            verified: true,
            verificationCount: location.verificationCount + 1,
            contributors: updatedContributors,
          };

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
          
          // Award points for verification
          if (user) {
            usePointsStore.getState().addPoints(
              user.id,
              locationId,
              'verify_location',
              0.1
            );
          }
          
          // Distribute engagement points
          usePointsStore.getState().distributeEngagementPoints(locationId, 0.1);
        } catch (error) {
          set({ error: 'Failed to verify location', isLoading: false });
        }
      },

      addImageToLocation: async (locationId, imageUrl) => {
        set({ isLoading: true, error: null });
        try {
          const { locations } = get();
          const locationIndex = locations.findIndex(loc => loc.id === locationId);
          
          if (locationIndex === -1) {
            throw new Error('Location not found');
          }

          const location = locations[locationIndex];
          
          // Add to allImages array
          const updatedAllImages = [...location.allImages, imageUrl];
          
          // Update the first 10 images for display
          const updatedImages = updatedAllImages.slice(0, 10);
          
          // Add contributor if not already a contributor
          let updatedContributors = [...location.contributors];
          const user = useAuthStore.getState().user;
          const userId = user ? user.id : 'anonymous';
          
          if (!updatedContributors.some(c => c.userId === userId && c.contribution === 'image')) {
            updatedContributors.push({
              userId,
              username: user?.username || null,
              isAnonymous: user ? user.isAnonymous : true,
              contribution: 'image',
              createdAt: Date.now(),
            });
          }

          const updatedLocation = {
            ...location,
            images: updatedImages,
            allImages: updatedAllImages,
            contributors: updatedContributors,
          };

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
          
          // Award points for adding an image
          if (user) {
            usePointsStore.getState().addPoints(
              user.id,
              locationId,
              'add_image',
              0.1
            );
          }
          
          // Distribute engagement points
          usePointsStore.getState().distributeEngagementPoints(locationId, 0.1);
        } catch (error) {
          set({ error: 'Failed to add image', isLoading: false });
        }
      },

      removeImageFromLocation: async (locationId, imageUrl) => {
        set({ isLoading: true, error: null });
        try {
          const { locations } = get();
          const locationIndex = locations.findIndex(loc => loc.id === locationId);
          
          if (locationIndex === -1) {
            throw new Error('Location not found');
          }

          const location = locations[locationIndex];
          const user = useAuthStore.getState().user;
          
          // Only the creator can remove images
          if (user?.id !== location.createdBy) {
            throw new Error('Only the creator can remove images');
          }
          
          // Remove from allImages array
          const updatedAllImages = location.allImages.filter(img => img !== imageUrl);
          
          // Update the first 10 images for display
          const updatedImages = updatedAllImages.slice(0, 10);

          const updatedLocation = {
            ...location,
            images: updatedImages,
            allImages: updatedAllImages,
          };

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to remove image', isLoading: false });
        }
      },
    }),
    {
      name: 'where-locations-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        locations: state.locations,
        // Don't persist these states
        selectedLocation: null,
        isLoading: false,
        error: null,
      }),
    }
  )
);
