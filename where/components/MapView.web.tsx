import React, { useEffect, useMemo, useRef } from 'react';
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

export default function WebMapView({ locations, userLocation, onMarkerPress, initialRegion, isDarkMode }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const tileLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const mapId = useMemo(() => `leaflet-map-${Math.random().toString(36).slice(2)}`, []);

  const center = useMemo(() => [initialRegion.latitude, initialRegion.longitude] as [number, number], [initialRegion.latitude, initialRegion.longitude]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!LRef.current) {
          LRef.current = await import('leaflet');
        }
        const L = LRef.current;
        if (!isMounted) return;

        if (!containerRef.current) return;

        if (!mapRef.current) {
          try {
            const anyContainer = containerRef.current as unknown as { _leaflet_id?: number } | null;
            if (anyContainer && (anyContainer as any)._leaflet_id) {
              (anyContainer as any)._leaflet_id = undefined;
            }
          } catch {}
          mapRef.current = L.map(containerRef.current).setView(center, 13);
        }

        const map = mapRef.current;

        if (tileLayerRef.current) {
          tileLayerRef.current.remove();
          tileLayerRef.current = null;
        }

        const tileUrl = isDarkMode
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: isDarkMode
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

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
            icon: customIcon,
          }).addTo(map);

          marker.on('click', () => onMarkerPress(location.id));
          markersRef.current.push(marker);
        });

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
            icon: userIcon,
          }).addTo(map);

          markersRef.current.push(userMarker);
        }
      } catch (e) {
        console.error('WebMapView init/update error', e);
      }
    })();

    return () => {
      isMounted = false;
      try {
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        if (tileLayerRef.current) {
          tileLayerRef.current.remove();
          tileLayerRef.current = null;
        }
        if (mapRef.current) {
          try { mapRef.current.off(); } catch {}
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (e) {
        console.warn('WebMapView cleanup warning', e);
      }
    };
  }, [center, isDarkMode, locations, onMarkerPress, userLocation]);

  return (
    <div
      ref={containerRef}
      id={mapId}
      data-testid="leaflet-map"
      style={{ width: '100%', height: '100%', zIndex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
