import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2, Heart } from 'lucide-react-native';
import { useLocationsStore } from '@/store/locations-store';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { usePointsStore } from '@/store/points-store';

export default function AllImagesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useThemeStore();
  const { fetchLocationById, selectedLocation, removeImageFromLocation, isLoading } = useLocationsStore();
  const { user } = useAuthStore();
  const { likeImage, unlikeImage, isImageLikedByUser, getImageLikes } = usePointsStore();
  
  useEffect(() => {
    if (id) {
      fetchLocationById(id as string);
    }
  }, [id]);

  const handleDeleteImage = (imageUrl: string) => {
    if (!selectedLocation) return;
    
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeImageFromLocation(selectedLocation.id, imageUrl);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete image');
            }
          }
        },
      ]
    );
  };
  
  const handleLikeImage = (imageUrl: string) => {
    if (!user || !selectedLocation) return;
    
    const isLiked = isImageLikedByUser(user.id, imageUrl);
    
    if (isLiked) {
      unlikeImage(user.id, selectedLocation.id, imageUrl);
    } else {
      likeImage(user.id, selectedLocation.id, imageUrl);
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const canDelete = user?.id === selectedLocation?.createdBy;
    const isLiked = user ? isImageLikedByUser(user.id, item) : false;
    const likeCount = getImageLikes(item);
    
    return (
      <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
        <Image source={{ uri: item }} style={styles.image} />
        
        <View style={styles.imageActions}>
          <TouchableOpacity 
            style={[styles.likeButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
            onPress={() => handleLikeImage(item)}
          >
            <Heart 
              size={20} 
              color={colors.card} 
              fill={isLiked ? colors.love : 'transparent'} 
            />
            {likeCount > 0 && (
              <Text style={styles.likeCount}>{likeCount}</Text>
            )}
          </TouchableOpacity>
          
          {canDelete && (
            <TouchableOpacity 
              style={[styles.deleteButton, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
              onPress={() => handleDeleteImage(item)}
            >
              <Trash2 size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading images...</Text>
      </View>
    );
  }

  if (!selectedLocation) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>Location not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>All Images for {selectedLocation.name}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {selectedLocation.allImages.length} images
      </Text>
      
      <FlatList
        data={selectedLocation.allImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  imageContainer: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  deleteButton: {
    borderRadius: 20,
    padding: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 8,
  },
  likeCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});
