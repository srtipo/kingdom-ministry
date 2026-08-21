import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { IconButton } from "@/src/presentation/ui/buttons/icon-button";
import TextInput from "@/src/presentation/ui/input/text-input";
import { Dropdown } from "@/src/presentation/ui/menu/dropdown";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import { TIME_UNIT_OPTIONS } from "../helpers/reminder-conversion";
import { VisitReminder } from "../types/visit-reminder";

export default function ReminderRow({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: VisitReminder;
  onChange: (next: VisitReminder) => void;
  onRemove: () => void;
}) {
  const color = useThemeColor();
  const handleUnitChange = (next: string) => {
    onChange({
      ...value,
      unit: next as VisitReminder["unit"],
    });
  };
  const handleValueChange = (text: string) => {
    const parsed = parseInt(text.replace(/[^0-9]/g, ""), 10);
    onChange({
      ...value,
      value: Number.isNaN(parsed) || parsed <= 0 ? 0 : parsed,
    });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: color.elevation.level2,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: color.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text fontWeight="bold" style={{ color: color.primary }}>
          {index}
        </Text>
      </View>
      <View style={{ height: 36 }}>
        <TextInput
          value={String(value.value)}
          compact
          onChangeText={handleValueChange}
          keyboardType="number-pad"
          style={{ height: 36, textAlign: "center" }}
        />
      </View>
      <Dropdown
        value={value.unit}
        options={TIME_UNIT_OPTIONS}
        onChange={handleUnitChange}
        minWidth={140}
        style={{ height: 36 }}
      />
      <IconButton
        icon="trash-can-outline"
        color={color.danger}
        iconSize={20}
        type="outlined"
        border="none"
        onPress={onRemove}
        borderRadius={10}
      />
    </View>
  );
}
