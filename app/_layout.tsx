import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { migrateDbIfNeeded } from "@/src/data/database/db";
import {
  customDarkTheme,
  customLightTheme,
} from "@/src/presentation/constants/theme";
import { useColorScheme } from "@/src/presentation/hooks/use-color-scheme.web";
import { Text } from "@/src/presentation/ui/texts/text";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense fallback={<Text>Cargando Base de Datos...</Text>}>
        <QueryClientProvider client={queryClient} key={colorScheme}>
          <SQLiteProvider
            databaseName={process.env.EXPO_PUBLIC_DB_NAME}
            onInit={migrateDbIfNeeded}
            useSuspense
          >
            <PaperProvider
              theme={
                colorScheme === "dark" ? customDarkTheme : customLightTheme
              }
            >
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </PaperProvider>
          </SQLiteProvider>
        </QueryClientProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
