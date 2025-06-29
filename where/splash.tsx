import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useThemeStore();

  useEffect(() => {
    // Automatically navigate to the welcome screen after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={isDarkMode ? 
            ['rgba(26, 29, 31, 0.85)', 'rgba(42, 58, 74, 0.95)'] : 
            ['rgba(74, 128, 240, 0.85)', 'rgba(93, 141, 244, 0.95)']}
          style={styles.gradient}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Compass size={80} color="white" />
            </View>
            <Text style={styles.logoText}>Where</Text>
          </View>
          <Text style={styles.tagline}>Find your next adventure</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  gradient: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
});
