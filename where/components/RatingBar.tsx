import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStore } from '@/store/theme-store';

interface RatingBarProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export default function RatingBar({ label, value, onChange, readonly = false }: RatingBarProps) {
  const { colors } = useThemeStore();
  const [localValue, setLocalValue] = useState(value);
  
  const handlePress = (index: number) => {
    if (readonly) return;
    
    const newValue = index + 1;
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const getBarColor = (index: number) => {
    const threshold = readonly ? value : localValue;
    
    if (index < threshold) {
      // Color gradient based on value
      if (label === 'Violence' || label === 'Pickpocketing' || label === 'Hookers') {
        // For negative attributes, red is good (low value)
        return index < 3 ? colors.success : 
               index < 7 ? colors.warning : 
               colors.danger;
      } else {
        // For positive attributes, green is good (high value)
        return index > 6 ? colors.success : 
               index > 3 ? colors.warning : 
               colors.danger;
      }
    }
    
    return colors.inactive;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.barContainer}>
        {[...Array(10)].map((_, index) => (
          <Pressable
            key={index}
            style={[
              styles.bar,
              { backgroundColor: getBarColor(index) }
            ]}
            onPress={() => handlePress(index)}
            disabled={readonly}
          />
        ))}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{readonly ? value.toFixed(1) : localValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    width: 100,
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  bar: {
    flex: 1,
    height: '100%',
    marginHorizontal: 1,
  },
  value: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
