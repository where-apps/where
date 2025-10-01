import React from 'react';
import { StyleSheet } from 'react-native';
import { Location } from '@/types';

interface MapViewProps {
  locations: Location[];
  userLocation: { latitude: number; longitude: number } | null;
  onMarkerPress: (locationId: string) => void;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  isDarkMode: boolean;
  colors: any;
  mapRef?: React.RefObject<any>;
}

export default function NativeMapView(props: MapViewProps) {
  const MapViewModule = require('react-native-maps');
  const MapView = MapViewModule.default;
  const Marker = MapViewModule.Marker;

  return (
    <MapView
      ref={props.mapRef}
      style={styles.map}
      initialRegion={props.initialRegion}
    >
      {props.locations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          onPress={() => props.onMarkerPress(location.id)}
        />
      ))}
      {props.userLocation && (
        <Marker coordinate={props.userLocation} title="You are here" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
