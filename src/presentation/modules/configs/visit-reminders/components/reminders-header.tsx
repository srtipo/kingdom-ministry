import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { IconButton } from "@/src/presentation/ui/buttons/icon-button";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";

export default function RemindersHeader({
  title,
  subtitle,
  onEditPress,
  editing,
}: {
  title: string;
  subtitle: string;
  onEditPress: () => void;
  editing?: boolean;
}) {
  const color = useThemeColor();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon type="bell-outline" size={22} color={color.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text fontWeight="bold" type="large">
          {title}
        </Text>
        <Text style={{ color: color.onSurfaceVariant }}>{subtitle}</Text>
      </View>
      <IconButton
        icon={editing ? "check" : "pencil-outline"}
        iconSize={20}
        color={color.primary}
        type="outlined"
        border="none"
        borderRadius={10}
        onPress={onEditPress}
      />
    </View>
  );
}