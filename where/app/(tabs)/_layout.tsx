import React from "react";
import { Tabs } from "expo-router";
import { MapPin, Search, User, Plus } from "lucide-react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme-store";

export default function TabLayout() {
  const router = useRouter();
  const { colors } = useThemeStore();

  const handleAddLocation = () => {
    router.push("/add-location");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
              <Plus size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginRight: 16,
    padding: 8,
  },
});
