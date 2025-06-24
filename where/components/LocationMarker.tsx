import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Location } from '@/types';

interface LocationMarkerProps {
  location: Location;
  onPress: () => void;
}

export default function LocationMarker({ location, onPress }: LocationMarkerProps) {
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

  const averageRating = parseFloat(calculateAverageRating());
  
  // Determine color based on rating
  const getMarkerColor = () => {
    if (averageRating >= 7.5) return colors.success;
    if (averageRating >= 5) return colors.warning;
    return colors.danger;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: getMarkerColor() }]}>
        <Text style={styles.rating}>{averageRating}</Text>
        <Star size={12} color="white" fill="white" style={styles.star} />
      </View>
      <View style={[styles.pointer, { borderTopColor: getMarkerColor() }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  rating: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  star: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -1,
  },
});
