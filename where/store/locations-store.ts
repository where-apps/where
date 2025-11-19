import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, Rating, Comment, Contributor } from '@/types';
import { useAuthStore } from './auth-store';
import { usePointsStore } from './points-store';
import { trpcClient } from '@/lib/trpc';

interface LocationsState {
  locations: Location[];
  locationCids: Map<string, string>;
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<Location | null>;
  fetchLocationByCid: (cid: string) => Promise<Location | null>;
  selectLocation: (location: Location | null) => void;
  addLocation: (location: Partial<Location>) => Promise<Location>;
  addComment: (locationId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  rateLocation: (locationId: string, ratings: Rating) => Promise<void>;
  verifyLocation: (locationId: string) => Promise<void>;
  addImageToLocation: (locationId: string, imageUrl: string) => Promise<void>;
  removeImageFromLocation: (locationId: string, imageUrl: string) => Promise<void>;
}

const MOCK_LOCATIONS: Location[] = [
  // Mumbai Locations
  {
    id: 'loc_mumbai_1',
    name: 'Gateway of India',
    description: 'Historic monument and popular tourist spot in South Mumbai. Great for photos and evening walks.',
    latitude: 18.9220,
    longitude: 72.8347,
    images: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800',
    ],
    ratings: {
      security: 4.2,
      violence: 1.5,
      welcoming: 4.5,
      streetFood: 3.8,
      restaurants: 4.0,
      pickpocketing: 2.3,
      qualityOfLife: 4.0,
    },
    ratingCount: 156,
    comments: [
      {
        id: 'comment_mumbai_1',
        userId: 'user_demo_1',
        username: 'TravellerMumbai',
        isAnonymous: false,
        text: 'Beautiful monument! Best visited early morning to avoid crowds.',
        createdAt: Date.now() - 86400000,
      },
    ],
    createdBy: 'user_demo_1',
    createdAt: Date.now() - 7776000000,
    verified: true,
    verificationCount: 45,
    contributors: [
      {
        userId: 'user_demo_1',
        username: 'TravellerMumbai',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 7776000000,
      },
    ],
  },
  {
    id: 'loc_mumbai_2',
    name: 'Colaba Causeway',
    description: 'Vibrant shopping street with street vendors, boutiques, and cafes. Great for souvenirs and street food.',
    latitude: 18.9067,
    longitude: 72.8147,
    images: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
    ],
    ratings: {
      security: 3.8,
      violence: 1.8,
      welcoming: 4.3,
      streetFood: 4.5,
      restaurants: 4.2,
      pickpocketing: 3.0,
      qualityOfLife: 3.9,
    },
    ratingCount: 98,
    comments: [],
    createdBy: 'user_demo_2',
    createdAt: Date.now() - 6048000000,
    verified: true,
    verificationCount: 32,
    contributors: [
      {
        userId: 'user_demo_2',
        username: 'ShopperBombay',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 6048000000,
      },
    ],
  },
  {
    id: 'loc_mumbai_3',
    name: 'Marine Drive',
    description: 'Iconic seafront promenade, perfect for evening walks and sunset views. Very safe and peaceful.',
    latitude: 18.9432,
    longitude: 72.8239,
    images: [
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    ],
    ratings: {
      security: 4.5,
      violence: 1.2,
      welcoming: 4.7,
      streetFood: 4.0,
      restaurants: 3.8,
      pickpocketing: 1.8,
      qualityOfLife: 4.5,
    },
    ratingCount: 203,
    comments: [
      {
        id: 'comment_mumbai_2',
        userId: 'user_demo_3',
        username: 'SunsetLover',
        isAnonymous: false,
        text: 'The best place to unwind after a long day. Beautiful sunset views!',
        createdAt: Date.now() - 172800000,
      },
    ],
    createdBy: 'user_demo_3',
    createdAt: Date.now() - 8640000000,
    verified: true,
    verificationCount: 67,
    contributors: [
      {
        userId: 'user_demo_3',
        username: 'SunsetLover',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 8640000000,
      },
    ],
  },
  {
    id: 'loc_mumbai_4',
    name: 'Bandra-Worli Sea Link',
    description: 'Architectural marvel connecting Bandra and Worli. Stunning views from nearby spots.',
    latitude: 19.0368,
    longitude: 72.8196,
    images: [
      'https://images.unsplash.com/photo-1589819364726-913de02d1d23?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1589819364726-913de02d1d23?w=800',
    ],
    ratings: {
      security: 4.3,
      violence: 1.0,
      welcoming: 4.2,
      streetFood: 2.5,
      restaurants: 3.5,
      pickpocketing: 1.5,
      qualityOfLife: 4.3,
    },
    ratingCount: 78,
    comments: [],
    createdBy: 'user_demo_4',
    createdAt: Date.now() - 5184000000,
    verified: true,
    verificationCount: 28,
    contributors: [
      {
        userId: 'user_demo_4',
        username: 'ArchitectureGeek',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 5184000000,
      },
    ],
  },
  // San Francisco Locations
  {
    id: 'loc_sf_1',
    name: 'Golden Gate Bridge',
    description: 'Iconic suspension bridge and San Francisco landmark. Best views from Battery Spencer or Crissy Field.',
    latitude: 37.8199,
    longitude: -122.4783,
    images: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800',
    ],
    ratings: {
      security: 4.5,
      violence: 1.2,
      welcoming: 4.6,
      streetFood: 3.0,
      restaurants: 3.5,
      pickpocketing: 1.8,
      qualityOfLife: 4.4,
    },
    ratingCount: 342,
    comments: [
      {
        id: 'comment_sf_1',
        userId: 'user_demo_5',
        username: 'BayAreaLocal',
        isAnonymous: false,
        text: 'Never gets old. A must-see for anyone visiting SF!',
        createdAt: Date.now() - 259200000,
      },
    ],
    createdBy: 'user_demo_5',
    createdAt: Date.now() - 9504000000,
    verified: true,
    verificationCount: 89,
    contributors: [
      {
        userId: 'user_demo_5',
        username: 'BayAreaLocal',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 9504000000,
      },
    ],
  },
  {
    id: 'loc_sf_2',
    name: 'Fishermans Wharf',
    description: 'Tourist hotspot with seafood restaurants, street performers, and sea lions at Pier 39.',
    latitude: 37.8080,
    longitude: -122.4177,
    images: [
      'https://images.unsplash.com/photo-1562893296-3a31b2ba31ba?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1562893296-3a31b2ba31ba?w=800',
    ],
    ratings: {
      security: 3.9,
      violence: 1.5,
      welcoming: 4.3,
      streetFood: 4.2,
      restaurants: 4.5,
      pickpocketing: 2.8,
      qualityOfLife: 3.8,
    },
    ratingCount: 267,
    comments: [
      {
        id: 'comment_sf_2',
        userId: 'user_demo_6',
        username: 'FoodieExplorer',
        isAnonymous: false,
        text: 'Clam chowder in a sourdough bread bowl is a must! Watch your belongings though.',
        createdAt: Date.now() - 432000000,
      },
    ],
    createdBy: 'user_demo_6',
    createdAt: Date.now() - 8208000000,
    verified: true,
    verificationCount: 71,
    contributors: [
      {
        userId: 'user_demo_6',
        username: 'FoodieExplorer',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 8208000000,
      },
    ],
  },
  {
    id: 'loc_sf_3',
    name: 'Alamo Square (Painted Ladies)',
    description: 'Famous row of Victorian houses with stunning city skyline views. Perfect for photos.',
    latitude: 37.7762,
    longitude: -122.4330,
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    ],
    ratings: {
      security: 4.0,
      violence: 1.3,
      welcoming: 4.4,
      streetFood: 2.8,
      restaurants: 3.2,
      pickpocketing: 2.0,
      qualityOfLife: 4.2,
    },
    ratingCount: 145,
    comments: [],
    createdBy: 'user_demo_7',
    createdAt: Date.now() - 6912000000,
    verified: true,
    verificationCount: 52,
    contributors: [
      {
        userId: 'user_demo_7',
        username: 'PhotoEnthusiast',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 6912000000,
      },
    ],
  },
  {
    id: 'loc_sf_4',
    name: 'Mission District',
    description: 'Vibrant neighborhood known for amazing Mexican food, street art, and nightlife.',
    latitude: 37.7599,
    longitude: -122.4148,
    images: [
      'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800',
    ],
    ratings: {
      security: 3.2,
      violence: 2.5,
      welcoming: 4.1,
      streetFood: 4.8,
      restaurants: 4.7,
      pickpocketing: 3.2,
      qualityOfLife: 3.6,
    },
    ratingCount: 189,
    comments: [
      {
        id: 'comment_sf_3',
        userId: 'user_demo_8',
        username: 'TacoLover',
        isAnonymous: false,
        text: 'Best tacos and burritos in SF! Be cautious at night though.',
        createdAt: Date.now() - 518400000,
      },
    ],
    createdBy: 'user_demo_8',
    createdAt: Date.now() - 7344000000,
    verified: true,
    verificationCount: 43,
    contributors: [
      {
        userId: 'user_demo_8',
        username: 'TacoLover',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 7344000000,
      },
    ],
  },
  {
    id: 'loc_sf_5',
    name: 'Chinatown',
    description: 'Oldest Chinatown in North America. Authentic food, shops, and cultural experiences.',
    latitude: 37.7941,
    longitude: -122.4078,
    images: [
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
    ],
    allImages: [
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
    ],
    ratings: {
      security: 3.7,
      violence: 1.8,
      welcoming: 4.0,
      streetFood: 4.3,
      restaurants: 4.6,
      pickpocketing: 2.7,
      qualityOfLife: 3.7,
    },
    ratingCount: 178,
    comments: [],
    createdBy: 'user_demo_9',
    createdAt: Date.now() - 7776000000,
    verified: true,
    verificationCount: 56,
    contributors: [
      {
        userId: 'user_demo_9',
        username: 'AsianFoodFan',
        isAnonymous: false,
        contribution: 'image',
        createdAt: Date.now() - 7776000000,
      },
    ],
  },
];

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set, get) => ({
      locations: MOCK_LOCATIONS,
      locationCids: new Map(),
      selectedLocation: null,
      isLoading: false,
      error: null,

      fetchLocations: async () => {
        set({ isLoading: true, error: null });
        try {
          set({ locations: MOCK_LOCATIONS, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch locations', isLoading: false });
        }
      },

      fetchLocationById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const location = get().locations.find(loc => loc.id === id) || null;
          set({ selectedLocation: location, isLoading: false });
          return location;
        } catch (error) {
          set({ error: 'Failed to fetch location', isLoading: false });
          return null;
        }
      },

      fetchLocationByCid: async (cid: string) => {
        set({ isLoading: true, error: null });
        try {
          const location = await trpcClient.locations.get.query({ cid });
          set({ selectedLocation: location, isLoading: false });
          return location;
        } catch (error) {
          console.error('[S5] Failed to fetch location:', error);
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
          const user = useAuthStore.getState().user;
          
          const result = await trpcClient.locations.create.mutate({
            name: locationData.name || 'Unnamed Location',
            description: locationData.description || '',
            latitude: locationData.latitude || 0,
            longitude: locationData.longitude || 0,
            images: locationData.images || [],
            createdBy: locationData.createdBy || (user ? user.id : 'anonymous'),
            isAnonymous: user ? user.isAnonymous : true,
            username: user?.username || null,
          });

          const newLocation = result.location;
          const { locationCids } = get();
          locationCids.set(newLocation.id, result.cid);
          
          const updatedLocations = [...get().locations, newLocation];
          set({ locations: updatedLocations, locationCids, isLoading: false });
          
          console.log('[S5] Location stored:', { id: newLocation.id, cid: result.cid });
          
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
          console.error('[S5] Failed to add location:', error);
          set({ error: 'Failed to add location', isLoading: false });
          throw error;
        }
      },

      addComment: async (locationId, commentData) => {
        set({ isLoading: true, error: null });
        try {
          const { locations, locationCids } = get();
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

          await trpcClient.comments.add.mutate({
            comment: newComment,
            locationId,
          });

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

          const cid = locationCids.get(locationId);
          if (cid) {
            const result = await trpcClient.locations.update.mutate({
              cid,
              location: updatedLocation,
            });
            locationCids.set(locationId, result.cid);
            console.log('[S5] Location updated with new comment:', { cid: result.cid });
          }

          const updatedLocations = [...locations];
          updatedLocations[locationIndex] = updatedLocation;

          set({ 
            locations: updatedLocations,
            locationCids,
            selectedLocation: updatedLocation,
            isLoading: false 
          });
          
          usePointsStore.getState().addPoints(
            commentData.userId,
            locationId,
            'comment',
            0.1
          );
          
          usePointsStore.getState().distributeEngagementPoints(locationId, 0.1);
        } catch (error) {
          console.error('[S5] Failed to add comment:', error);
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
        locationCids: Array.from(state.locationCids.entries()),
        selectedLocation: null,
        isLoading: false,
        error: null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.locationCids)) {
          state.locationCids = new Map(state.locationCids as any);
        }
      },
    }
  )
);
