import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Search } from 'lucide-react-native';
import { useLocationsStore } from '@/store/locations-store';
import LocationCard from '@/components/LocationCard';
import { useThemeStore } from '@/store/theme-store';
import { Location } from '@/types';
import { useTranslation } from 'react-i18next';

export default function SearchScreen() {
  const { locations, fetchLocations, isLoading } = useLocationsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const { colors } = useThemeStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(query) || 
        location.description.toLowerCase().includes(query)
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>{t('loading_locations')}</Text>
        </View>
      );
    }
    
    if (searchQuery.trim() !== '') {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {t('no_locations_found_for')} "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>{t('no_locations_available')}</Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          {t('locations_will_appear')}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('search_locations')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <FlatList
        data={filteredLocations}
        renderItem={({ item }) => <LocationCard location={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
