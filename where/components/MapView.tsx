import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Location } from '@/types';
import LocationMarker from './LocationMarker';

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

// Web Map Component using Leaflet
const WebMapView = ({ locations, userLocation, onMarkerPress, initialRegion, isDarkMode }: MapViewProps) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Dynamically import Leaflet only on web
    import('leaflet').then((L) => {
      // Clear existing map
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Create map
      const map = L.map('leaflet-map').setView(
        [initialRegion.latitude, initialRegion.longitude],
        13
      );
      mapRef.current = map;

      // Add tile layer
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      L.tileLayer(tileUrl, {
        attribution: isDarkMode
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add location markers
      locations.forEach(location => {
        const { ratings } = location;
        const sum = (
          ratings.security +
          (10 - ratings.violence) +
          ratings.welcoming +
          ratings.streetFood +
          ratings.restaurants +
          (10 - ratings.pickpocketing) +
          ratings.qualityOfLife +
          (10 - ratings.hookers)
        );
        const averageRating = (sum / 8).toFixed(1);
        
        const getMarkerColor = () => {
          const rating = parseFloat(averageRating);
          if (rating >= 7.5) return '#10B981';
          if (rating >= 5) return '#F59E0B';
          return '#EF4444';
        };

        const customIcon = L.divIcon({
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background-color: ${getMarkerColor()};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              position: relative;
            ">
              ${averageRating}
              <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid ${getMarkerColor()};
              "></div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [40, 48],
          iconAnchor: [20, 48],
        });

        const marker = L.marker([location.latitude, location.longitude], {
          icon: customIcon
        }).addTo(map);
        
        marker.on('click', () => onMarkerPress(location.id));
        markersRef.current.push(marker);
      });

      // Add user location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background-color: #3B82F6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'user-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
          icon: userIcon
        }).addTo(map);
        
        markersRef.current.push(userMarker);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [locations, userLocation, initialRegion, isDarkMode, onMarkerPress]);

  return (
    <div 
      id="leaflet-map" 
      style={{ 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }} 
    />
  );
};

// Native Map Component
const NativeMapView = ({ locations, userLocation, onMarkerPress, initialRegion, isDarkMode, colors, mapRef }: MapViewProps) => {
  if (Platform.OS === 'web') return null;
  
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MapViewModule = require('react-native-maps');
  const MapView = MapViewModule.default;
  const Marker = MapViewModule.Marker;

  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      customMapStyle={isDarkMode ? darkMapStyle : []}
    >
      {locations.map(location => (
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onPress={() => onMarkerPress(location.id)}
        >
          <LocationMarker 
            location={location} 
            onPress={() => onMarkerPress(location.id)} 
          />
        </Marker>
      ))}
      
      {userLocation && (
        <Marker
          coordinate={userLocation}
          pinColor={colors.primary}
          title="You are here"
        />
      )}
    </MapView>
  );
};

// Main MapView Component
export default function CrossPlatformMapView(props: MapViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <WebMapView {...props} />
      </View>
    );
  }
  
  return <NativeMapView {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
});
