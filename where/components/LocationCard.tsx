import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import { Location } from '@/types';
import { useThemeStore } from '@/store/theme-store';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  
  const handlePress = () => {
    router.push(`/location/${location.id}`);
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    const { ratings } = location;
    const sum = (
      ratings.security +
      (10 - ratings.violence) + // Invert negative ratings
      ratings.welcoming +
      ratings.streetFood +
      ratings.restaurants +
      (10 - ratings.pickpocketing) + // Invert negative ratings
      ratings.qualityOfLife +
      (10 - ratings.hookers) // Invert negative ratings
    );
    return (sum / 8).toFixed(1);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: location.images[0] }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{location.name}</Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          <Star size={16} color={colors.secondary} fill={colors.secondary} />
          <Text style={[styles.rating, { color: colors.text }]}>{calculateAverageRating()}</Text>
          <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>({location.ratingCount} ratings)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 4,
  },
});
