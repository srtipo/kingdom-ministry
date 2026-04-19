import { Tabs } from "expo-router";
import React from "react";

import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const color = useThemeColor();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: color.onBackground,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Revisitas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="people" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
