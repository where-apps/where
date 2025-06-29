import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { Compass } from 'lucide-react-native';

interface WhereLogoProps {
  size?: number;
  showText?: boolean;
}

export default function WhereLogo({ size = 100, showText = true }: WhereLogoProps) {
  const { colors } = useThemeStore();
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.logoContainer, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: colors.primary 
        }
      ]}>
        <Compass size={size * 0.6} color="white" />
      </View>
      {showText && (
        <Text style={[styles.logoText, { color: colors.primary, fontSize: size * 0.4 }]}>
          Where
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});
