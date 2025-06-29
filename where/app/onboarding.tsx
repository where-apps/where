import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, Star, Users, Compass } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useThemeStore();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    router.replace('/splash');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDarkMode ? 
          ['#1A1D1F', '#2A3A4A'] : 
          ['#4A80F0', '#5D8DF4']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Compass size={80} color="white" />
            </View>
            <Text style={styles.logoText}>Where</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Discover and share amazing locations around the world
          </Text>
          
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Globe size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Discover Places</Text>
                <Text style={styles.featureDescription}>
                  Find and explore interesting locations
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
                <Star size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Rate & Review</Text>
                <Text style={styles.featureDescription}>
                  Share your experiences with others
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
                <Users size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Earn Points</Text>
                <Text style={styles.featureDescription}>
                  Get rewarded for your contributions
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: 'white',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
});
