import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useLocationsStore } from '@/store/locations-store';
import { useThemeStore } from '@/store/theme-store';
import CrossPlatformMapView from '@/components/MapView';
import { MapPin, AlertCircle } from 'lucide-react-native';

export default function MapScreen() {
  const router = useRouter();
  const { locations, fetchLocations, isLoading } = useLocationsStore();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { colors, isDarkMode } = useThemeStore();
  
  // Properly type the mapRef
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetchLocations();
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        setErrorMsg('Could not get your location');
      }
    })();
  }, []);

  const handleMarkerPress = (locationId: string) => {
    router.push(`/location/${locationId}`);
  };

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Default to San Francisco if no user location
  const initialRegion = userLocation ? {
    ...userLocation,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Add Leaflet CSS for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={24} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.text }]}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          <CrossPlatformMapView
            locations={locations}
            userLocation={userLocation}
            onMarkerPress={handleMarkerPress}
            initialRegion={initialRegion}
            isDarkMode={isDarkMode}
            colors={colors}
            mapRef={mapRef}
          />
          
          {userLocation && (
            <TouchableOpacity 
              style={[styles.locationButton, { backgroundColor: colors.card }]} 
              onPress={goToUserLocation}
            >
              <MapPin size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
