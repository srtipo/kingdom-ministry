import { Stack } from "expo-router";

export default function VisitLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Organizador de Revisitas" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Detalle", headerTitleAlign: "center" }}
      />
    </Stack>
  );
}
