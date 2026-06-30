import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";

export function NoAttendanceHistory() {
  const colors = useThemeColor();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.elevation.level1,
          borderRadius: 100,
          padding: 10,
        }}
      >
        <Icon type={"file-document-outline"} size={40} color={colors.primary} />
      </View>
      <Text type={"large"} color={colors.onSurface} fontWeight={"bold"}>
        {"No hay visitas registradas aún"}
      </Text>
    </View>
  );
}
