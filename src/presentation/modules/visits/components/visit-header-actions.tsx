import { IconButton } from "@/src/presentation/ui/buttons/icon-button";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { View } from "react-native";

export function VisitHeaderActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colors = useThemeColor();
  return (
    <View style={{ flexDirection: "row" }}>
      <IconButton
        type="outlined"
        icon="pencil-outline"
        iconSize={20}
        color={colors.primary}
        border={0}
        onPress={onEdit}
      />
      <IconButton
        type="outlined"
        icon="trash-can-outline"
        iconSize={20}
        color={colors.error}
        border={0}
        onPress={onDelete}
      />
    </View>
  );
}
