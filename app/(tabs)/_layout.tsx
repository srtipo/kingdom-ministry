import { Tabs } from "expo-router";
import React from "react";

import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { useHandlerNotificationsClicked } from "@/src/presentation/modules/notifications/hooks/handler-notifications-clicked";
import { SnackBarProvider } from "@/src/presentation/ui/snackbars/snackbar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const color = useThemeColor();
  useHandlerNotificationsClicked();
  return (
    <SnackBarProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: color.onBackground,
        }}
      >
        <Tabs.Screen
          name="visit"
          options={{
            headerShown: false,
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
    </SnackBarProvider>
  );
}
