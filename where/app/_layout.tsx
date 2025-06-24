import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useThemeStore } from "@/store/theme-store";
import { StatusBar } from "expo-status-bar";
import './i18n';

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const colorScheme = useColorScheme();
  const { setSystemTheme } = useThemeStore();
  
  // Set the system theme when it changes
  useEffect(() => {
    setSystemTheme(colorScheme as ColorSchemeName);
  }, [colorScheme]);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colors, isDarkMode } = useThemeStore();
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.card,
              },
              headerTintColor: colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="location/[id]" 
              options={{ 
                title: "Location Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                title: "Login",
                headerBackTitle: "Back",
                presentation: "modal",
              }} 
            />
            <Stack.Screen 
              name="auth/signup" 
              options={{ 
                title: "Sign Up",
                headerBackTitle: "Back",
                presentation: "modal",
              }} 
            />
            <Stack.Screen 
              name="add-location" 
              options={{ 
                title: "Add Location",
                headerBackTitle: "Back",
                presentation: "modal",
              }} 
            />
            <Stack.Screen 
              name="referral" 
              options={{ 
                title: "Invite Friends",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="my-locations" 
              options={{ 
                title: "My Locations",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                title: "Settings",
                headerBackTitle: "Back",
              }} 
            />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}
