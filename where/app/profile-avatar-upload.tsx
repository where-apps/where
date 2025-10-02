import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { uploadToS5, retryFailedUploads } from '@/lib/s5';
import { Image as ImageIcon } from 'lucide-react-native';

let ImagePicker: any = null;
if (Platform.OS !== 'web') {
  ImagePicker = require('expo-image-picker');
}

export default function ProfileAvatarUpload() {
  const { user, users, isAuthenticated } = useAuthStore();
  const setUser = useAuthStore((s) => s);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    retryFailedUploads().catch(() => {});
  }, []);

  const pickAvatar = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not available', 'Avatar upload is available on mobile only for now.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        setUploading(true);
        const asset = result.assets[0];
        const type = asset.mimeType ?? 'image/jpeg';
        const name = asset.fileName ?? `avatar-${Date.now()}.jpg`;
        const { gatewayUrl } = await uploadToS5({ uri: asset.uri, name, type });

        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, profileImage: gatewayUrl } : state.user,
          users: state.user ? state.users.map((u) => (u.id === state.user!.id ? { ...u, profileImage: gatewayUrl } : u)) : state.users,
        }));
      } catch (e: any) {
        Alert.alert('Upload failed', e?.message ?? 'Unknown error');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {user.profileImage ? (
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <ImageIcon size={28} color="#888" />
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={pickAvatar} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Change Avatar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  button: { backgroundColor: '#111', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  placeholder: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
});
