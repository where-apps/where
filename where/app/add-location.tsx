import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Image as ImageIcon, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useLocationsStore } from '@/store/locations-store';
import { useAuthStore } from '@/store/auth-store';
import ImageCarousel from '@/components/ImageCarousel';
import { uploadToS5 } from '@/lib/s5';

// Only import on native platforms
let ImagePicker: any = null;
let Location: any = null;
if (Platform.OS !== 'web') {
  ImagePicker = require('expo-image-picker');
  Location = require('expo-location');
}

export default function AddLocationScreen() {
  const router = useRouter();
  const { addLocation, isLoading } = useLocationsStore();
  const { user } = useAuthStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      checkLocationPermission();
    }
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Error', 'Location services are not available on web');
      return;
    }
    
    setLocationLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
    
    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert('Error', 'Could not get your current location');
      }
    }
    setLocationLoading(false);
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Error', 'Image picker is not available on web');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      try {
        setUploading(true);
        const fileType = asset.mimeType ?? 'image/jpeg';
        const name = asset.fileName ?? `upload-${Date.now()}.jpg`;
        const { gatewayUrl } = await uploadToS5({ uri: asset.uri, name, type: fileType });
        setImages([...images, gatewayUrl]);
      } catch (e: any) {
        Alert.alert('Upload failed', e?.message ?? 'Unknown error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Error', 'Location services are required to add a location');
      return;
    }

    try {
      await addLocation({
        name,
        description,
        images,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        createdBy: user?.id || 'anonymous',
      });
      
      Alert.alert('Success', 'Location added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add location');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Location</Text>
        
        {images.length > 0 ? (
          <View style={styles.imagesContainer}>
            <ImageCarousel images={images} onAddImage={pickImage} editable />
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <ImageIcon size={40} color={colors.textSecondary} />
            <Text style={styles.imagePickerText}>Add at least one image</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe this location"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={styles.label}>Current Location</Text>
            {locationLoading ? (
              <View style={styles.locationLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.locationText}>Getting your location...</Text>
              </View>
            ) : locationPermission ? (
              currentLocation ? (
                <View style={styles.locationInfo}>
                  <MapPin size={20} color={colors.primary} />
                  <Text style={styles.locationText}>
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.locationButton} onPress={checkLocationPermission}>
                  <MapPin size={20} color={colors.primary} />
                  <Text style={styles.locationButtonText}>Get Current Location</Text>
                </TouchableOpacity>
              )
            ) : (
              <View style={styles.locationError}>
                <Text style={styles.locationErrorText}>
                  Location permission is required to add a new location
                </Text>
                <TouchableOpacity style={styles.locationButton} onPress={checkLocationPermission}>
                  <Text style={styles.locationButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <X size={20} color={colors.text} />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!name.trim() || images.length === 0 || !currentLocation || isLoading || uploading) && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!name.trim() || images.length === 0 || !currentLocation || isLoading || uploading}
        >
          {isLoading || uploading ? (
            <ActivityIndicator size="small" color={colors.card} />
          ) : (
            <>
              <MapPin size={20} color={colors.card} />
              <Text style={styles.submitButtonText}>Add Location</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  imagesContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePicker: {
    height: 200,
    backgroundColor: colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePickerText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  locationError: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  locationErrorText: {
    fontSize: 14,
    color: colors.danger,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.inactive,
  },
  submitButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.card,
    fontWeight: '600',
  },
});
