import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

export default function LoginScreen() {
  const router = useRouter();
  const { login, continueAsGuest, loginWithGoogle, loginWithFarcaster } = useAuthStore();
  const { colors } = useThemeStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to login with Google');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFarcasterLogin = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Not Available', 'Farcaster login is only available on web');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await loginWithFarcaster();
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to login with Farcaster');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.card }]}>
          <MapPin size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to Where</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to rate and add locations</Text>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Username"
            placeholderTextColor={colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colors.primary }]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LogIn size={20} color={colors.card} />
          <Text style={[styles.loginButtonText, { color: colors.card }]}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        
        {Platform.OS === 'web' && (
          <TouchableOpacity 
            style={[styles.farcasterButton, { backgroundColor: '#9B4DFF' }]} 
            onPress={handleFarcasterLogin}
            disabled={isLoading}
          >
            <Text style={styles.farcasterText}>Sign in with Farcaster</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.guestButton} 
          onPress={handleContinueAsGuest}
        >
          <Text style={[styles.guestButtonText, { color: colors.primary }]}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={[styles.signupText, { color: colors.primary }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import { MapPin, Lock } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 56,
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  googleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    height: 56,
    marginTop: 16,
    width: '100%',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  farcasterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 56,
    marginTop: 16,
    width: '100%',
  },
  farcasterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  guestButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
  },
  guestButtonText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  signupText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
