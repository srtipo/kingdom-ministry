import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import { QUICK_PRESETS, QuickPreset } from "../constants/quick-presets";
import { compareByMinutes } from "../helpers/reminder-conversion";
import { VisitReminder } from "../types/visit-reminder";

export default function QuickAddButtons({
  value,
  max,
  onChange,
}: {
  value: VisitReminder[];
  max: number;
  onChange: (items: VisitReminder[]) => void;
}) {
  const color = useThemeColor();
  const isSelected = (preset: QuickPreset) =>
    value.some((reminder) => compareByMinutes(reminder, preset));

  const handleToggle = (preset: QuickPreset) => {
    if (isSelected(preset)) {
      onChange(
        value.filter((reminder) => !compareByMinutes(reminder, preset)),
      );
    } else if (value.length < max) {
      onChange([...value, { value: preset.value, unit: preset.unit }]);
    }
  };
  return (
    <>
      <View style={{ paddingBottom: 8 }}>
        <Text
          type="small"
          style={{ color: color.onSurfaceVariant, fontWeight: "bold" }}
        >
          AGREGAR RÁPIDO
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {QUICK_PRESETS.map((preset) => {
          const selected = isSelected(preset);
          const disabled = !selected && value.length >= max;
          return (
            <Button
              key={preset.id}
              type="outlined"
              compact
              onPress={() => handleToggle(preset)}
              disabled={disabled}
              labelStyle={{ marginHorizontal: 15, marginVertical: 5 }}
              style={{
                borderRadius: 100,
                borderColor: selected ? color.primary : color.outlineVariant,
                borderWidth: selected ? 1.5 : 1,
                backgroundColor: selected ? color.primaryContainer : "transparent",
              }}
              textColor={selected ? color.primary : color.onSurface}
            >
              { preset.label}
            </Button>
          );
        })}
      </View>
    </>
  );
}
