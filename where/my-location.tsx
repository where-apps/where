import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocationsStore } from '@/store/locations-store';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import LocationCard from '@/components/LocationCard';
import { MapPin, Plus } from 'lucide-react-native';
import { Location } from '@/types';
import { useTranslation } from 'react-i18next';

export default function MyLocationsScreen() {
  const router = useRouter();
  const { locations, fetchLocations, isLoading } = useLocationsStore();
  const { user } = useAuthStore();
  const { colors } = useThemeStore();
  const [myLocations, setMyLocations] = useState<Location[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (user && locations.length > 0) {
      const userLocations = locations.filter(location => location.createdBy === user.id);
      setMyLocations(userLocations);
    } else {
      setMyLocations([]);
    }
  }, [user, locations]);

  const handleAddLocation = () => {
    router.push('/add-location');
  };

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>{t('loading_locations')}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MapPin size={60} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.text }]}>{t('no_locations_created')}</Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          {t('add_your_first_location')}
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddLocation}
        >
          <Plus size={20} color={colors.card} />
          <Text style={[styles.addButtonText, { color: colors.card }]}>{t('add_location')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={myLocations}
        renderItem={({ item }) => <LocationCard location={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={
          myLocations.length > 0 ? (
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t('your_locations')} ({myLocations.length})
              </Text>
              <TouchableOpacity 
                style={[styles.addLocationButton, { backgroundColor: colors.primary }]}
                onPress={handleAddLocation}
              >
                <Plus size={16} color={colors.card} />
                <Text style={[styles.addLocationText, { color: colors.card }]}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addLocationText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
