import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '@/constants/colors';
import { ColorSchemeName } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
  systemTheme: ColorSchemeName;
  colors: typeof lightColors;
  setTheme: (theme: ThemeType) => void;
  setSystemTheme: (theme: ColorSchemeName) => void;
  isDarkMode: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: 'light',
      colors: lightColors,
      isDarkMode: false,

      setTheme: (theme) => {
        set((state) => {
          const isDark = theme === 'dark' || (theme === 'system' && state.systemTheme === 'dark');
          return {
            theme,
            colors: isDark ? darkColors : lightColors,
            isDarkMode: isDark,
          };
        });
      },

      setSystemTheme: (systemTheme) => {
        set((state) => {
          const isDark = state.theme === 'system' && systemTheme === 'dark';
          return {
            systemTheme,
            colors: isDark ? darkColors : lightColors,
            isDarkMode: isDark,
          };
        });
      },
    }),
    {
      name: 'where-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
