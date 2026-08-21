import { Stack } from "expo-router";

export default function ConfigsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Ajustes", headerTitleAlign: "center" }}
      />
    </Stack>
  );
}
