import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, Star, CheckCircle, Image as ImageIcon, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useLocationsStore } from '@/store/locations-store';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import ImageCarousel from '@/components/ImageCarousel';
import RatingBar from '@/components/RatingBar';
import CommentItem from '@/components/CommentItem';
import AddCommentForm from '@/components/AddCommentForm';
import { Rating } from '@/types';
import * as ImagePicker from 'expo-image-picker';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useThemeStore();
  const { fetchLocationById, selectedLocation, addComment, rateLocation, verifyLocation, addImageToLocation, isLoading } = useLocationsStore();
  const { user, isAuthenticated, isAnonymous } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [newRatings, setNewRatings] = useState<Rating>({
    security: 5,
    violence: 5,
    welcoming: 5,
    streetFood: 5,
    restaurants: 5,
    pickpocketing: 5,
    qualityOfLife: 5,
    hookers: 5,
  });

  useEffect(() => {
    if (id) {
      fetchLocationById(id as string);
    }
  }, [id]);

  const handleAddComment = (text: string, isAnonymous: boolean) => {
    if (!selectedLocation || !user) return;
    
    addComment(selectedLocation.id, {
      userId: user.id,
      username: isAnonymous ? null : user.username,
      isAnonymous: isAnonymous,
      text,
    });
  };

  const handleRatingChange = (category: keyof Rating, value: number) => {
    setNewRatings(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmitRating = () => {
    if (!selectedLocation) return;
    
    rateLocation(selectedLocation.id, newRatings);
    setShowRatingForm(false);
  };

  const handleVerifyLocation = async () => {
    if (!selectedLocation || !user) return;
    
    setVerifying(true);
    try {
      // Check location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to verify this location');
        setVerifying(false);
        return;
      }
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;
      
      // Calculate distance (simple Euclidean distance for demo)
      const locationLat = selectedLocation.latitude;
      const locationLng = selectedLocation.longitude;
      
      const distance = Math.sqrt(
        Math.pow(userLat - locationLat, 2) + 
        Math.pow(userLng - locationLng, 2)
      );
      
      // If within ~1km (rough approximation)
      if (distance < 0.01) {
        await verifyLocation(selectedLocation.id);
        Alert.alert('Success', 'Location verified successfully!');
      } else {
        Alert.alert('Verification Failed', 'You need to be at this location to verify it');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify location');
    } finally {
      setVerifying(false);
    }
  };

  const handleAddImage = async () => {
    if (!selectedLocation || !user) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await addImageToLocation(selectedLocation.id, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add image');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading location details...</Text>
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
      <ScrollView style={styles.scrollView}>
        <ImageCarousel 
          images={selectedLocation.images} 
          allImages={selectedLocation.allImages}
          locationId={selectedLocation.id}
        />
        
        <View style={styles.detailsContainer}>
          <Text style={[styles.locationName, { color: colors.text }]}>{selectedLocation.name}</Text>
          <Text style={[styles.locationDescription, { color: colors.text }]}>{selectedLocation.description}</Text>
          
          <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <Star size={16} color={colors.secondary} fill={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {(Object.values(selectedLocation.ratings).reduce((a, b) => a + b, 0) / 8).toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Overall</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{selectedLocation.ratingCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ratings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{selectedLocation.comments.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Comments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{selectedLocation.verificationCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Verifications</Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={() => setShowRatingForm(!showRatingForm)}
            >
              <Star size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                {showRatingForm ? 'Cancel Rating' : 'Rate Location'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.verifyContainer}>
            <TouchableOpacity 
              style={[
                styles.verifyButton, 
                { backgroundColor: verifying ? colors.inactive : colors.success }
              ]}
              onPress={handleVerifyLocation}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator size="small" color={colors.card} />
              ) : (
                <>
                  <CheckCircle size={20} color={colors.card} />
                  <Text style={[styles.verifyButtonText, { color: colors.card }]}>Verify Location</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={[styles.verifyText, { color: colors.textSecondary }]}>
              Verify this location if you are currently there
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addImageButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleAddImage}
          >
            <ImageIcon size={20} color={colors.primary} />
            <Text style={[styles.addImageText, { color: colors.primary }]}>Add Image</Text>
          </TouchableOpacity>
          
          <View style={[styles.ratingsContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ratings</Text>
            <RatingBar label="Security" value={selectedLocation.ratings.security} readonly />
            <RatingBar label="Violence" value={selectedLocation.ratings.violence} readonly />
            <RatingBar label="Welcoming" value={selectedLocation.ratings.welcoming} readonly />
            <RatingBar label="Street Food" value={selectedLocation.ratings.streetFood} readonly />
            <RatingBar label="Restaurants" value={selectedLocation.ratings.restaurants} readonly />
            <RatingBar label="Pickpocketing" value={selectedLocation.ratings.pickpocketing} readonly />
            <RatingBar label="Quality of Life" value={selectedLocation.ratings.qualityOfLife} readonly />
            <RatingBar label="Hookers" value={selectedLocation.ratings.hookers} readonly />
          </View>
          
          {showRatingForm && (
            <View style={[styles.ratingFormContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Rating</Text>
              <RatingBar 
                label="Security" 
                value={newRatings.security} 
                onChange={(value) => handleRatingChange('security', value)} 
              />
              <RatingBar 
                label="Violence" 
                value={newRatings.violence} 
                onChange={(value) => handleRatingChange('violence', value)} 
              />
              <RatingBar 
                label="Welcoming" 
                value={newRatings.welcoming} 
                onChange={(value) => handleRatingChange('welcoming', value)} 
              />
              <RatingBar 
                label="Street Food" 
                value={newRatings.streetFood} 
                onChange={(value) => handleRatingChange('streetFood', value)} 
              />
              <RatingBar 
                label="Restaurants" 
                value={newRatings.restaurants} 
                onChange={(value) => handleRatingChange('restaurants', value)} 
              />
              <RatingBar 
                label="Pickpocketing" 
                value={newRatings.pickpocketing} 
                onChange={(value) => handleRatingChange('pickpocketing', value)} 
              />
              <RatingBar 
                label="Quality of Life" 
                value={newRatings.qualityOfLife} 
                onChange={(value) => handleRatingChange('qualityOfLife', value)} 
              />
              <RatingBar 
                label="Hookers" 
                value={newRatings.hookers} 
                onChange={(value) => handleRatingChange('hookers', value)} 
              />
              
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitRating}
              >
                <Text style={[styles.submitButtonText, { color: colors.card }]}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showComments && (
            <View style={styles.commentsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Comments</Text>
              {selectedLocation.comments.length > 0 ? (
                selectedLocation.comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              ) : (
                <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
                  No comments yet. Be the first to comment!
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      {showComments && (
        <AddCommentForm onSubmit={handleAddComment} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  detailsContainer: {
    padding: 16,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  verifyContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 8,
  },
  verifyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  verifyText: {
    fontSize: 12,
    textAlign: 'center',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addImageText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingFormContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginBottom: 16,
  },
  noCommentsText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
});
