import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Text, Platform } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { useRouter } from 'expo-router';
import { ChevronRight, Heart } from 'lucide-react-native';
import { usePointsStore } from '@/store/points-store';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  allImages?: string[];
  locationId?: string;
  onAddImage?: () => void;
  editable?: boolean;
}

export default function ImageCarousel({ 
  images, 
  allImages, 
  locationId,
  onAddImage, 
  editable = false 
}: ImageCarouselProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const { likeImage, unlikeImage, isImageLikedByUser, getImageLikes } = usePointsStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { t } = useTranslation();

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleLikeImage = (imageUrl: string) => {
    if (!user) return;
    
    if (locationId) {
      const isLiked = isImageLikedByUser(user.id, imageUrl);
      
      if (isLiked) {
        unlikeImage(user.id, locationId, imageUrl);
      } else {
        likeImage(user.id, locationId, imageUrl);
      }
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const isLiked = user ? isImageLikedByUser(user.id, item) : false;
    const likeCount = getImageLikes(item);
    
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
        
        {locationId && (
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={() => handleLikeImage(item)}
          >
            <Heart 
              size={24} 
              color={colors.card} 
              fill={isLiked ? colors.love : 'transparent'} 
            />
            {likeCount > 0 && (
              <Text style={styles.likeCount}>{likeCount}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAddButton = () => {
    if (!editable) return null;
    
    return (
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.border }]} onPress={onAddImage}>
        <Text style={[styles.addButtonText, { color: colors.textSecondary }]}>+</Text>
        <Text style={[styles.addButtonLabel, { color: colors.textSecondary }]}>{t('add_image')}</Text>
      </TouchableOpacity>
    );
  };

  const handleViewAllImages = () => {
    if (locationId && allImages && allImages.length > 10) {
      router.push(`/location/${locationId}/images`);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={renderAddButton}
      />
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: index === activeIndex ? colors.primary : 'rgba(255, 255, 255, 0.5)' },
              ]}
            />
          ))}
        </View>
      )}
      
      {images.length > 0 && (
        <View style={[styles.counter, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <Text style={styles.counterText}>
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {allImages && allImages.length > 10 && (
        <TouchableOpacity 
          style={[styles.viewAllButton, { backgroundColor: colors.primary }]} 
          onPress={handleViewAllImages}
        >
          <Text style={[styles.viewAllText, { color: colors.card }]}>{t('view_all')}</Text>
          <ChevronRight size={16} color={colors.card} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
  },
  imageContainer: {
    width,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  counter: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 40,
  },
  addButtonLabel: {
    marginTop: 8,
    fontSize: 16,
  },
  viewAllButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  likeCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
