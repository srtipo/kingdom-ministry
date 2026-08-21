import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Button } from "@/src/presentation/ui/buttons/ui-button";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Notice } from "@/src/presentation/ui/notices/notice";
import { Text } from "@/src/presentation/ui/texts/text";
import { useState } from "react";
import { View } from "react-native";
import { VisitReminder } from "../types/visit-reminder";
import QuickAddButtons from "./quick-add-buttons";
import ReminderRow from "./reminder-row";

const DEFAULT_REMINDERS: VisitReminder[] = [
  { value: 1, unit: "hours" },
  { value: 1, unit: "days" },
];

export default function EditVisitReminders({
  value,
  onSave,
  max = 5,
  isSaving,
}: {
  value: VisitReminder[];
  onSave: (items: VisitReminder[]) => void;
  max?: number;
  isSaving?: boolean;
}) {
  const color = useThemeColor();
  const [draft, setDraft] = useState<VisitReminder[]>(
    value.length > 0 ? value : DEFAULT_REMINDERS,
  );
  const canAdd = draft.length < max;
  const handleRowChange = (index: number) => (next: VisitReminder) => {
    setDraft(
      draft.map((reminder, currentIndex) =>
        currentIndex === index ? next : reminder,
      ),
    );
  };
  const handleRowRemove = (index: number) => () => {
    setDraft(draft.filter((_reminder, currentIndex) => currentIndex !== index));
  };
  const handleAdd = () => {
    setDraft([...draft, { value: 1, unit: "hours" }]);
  };
  return (
    <View>
      <QuickAddButtons value={draft} max={max} onChange={setDraft} />
      <View style={{ marginTop: 12, gap: 4 }}>
        {draft.map((reminder, index) => (
          <ReminderRow
            key={reminder.id ?? `reminder-${index}`}
            index={index + 1}
            value={reminder}
            onChange={handleRowChange(index)}
            onRemove={handleRowRemove(index)}
          />
        ))}
      </View>
      {canAdd ? (
        <Button
          type="outlined"
          mode="outlined"
          onPress={handleAdd}
          style={{
            marginTop: 12,
            borderRadius: 10,
            borderStyle: "dashed",
            borderColor: color.outlineVariant,
            paddingVertical: 6,
          }}
          textColor={color.onSurface}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              justifyContent: "center",
            }}
          >
            <Icon type="plus" size={18} color={color.onSurface} />
            <Text>Agregar recordatorio</Text>
          </View>
        </Button>
      ) : (
        <Text
          style={{
            textAlign: "center",
            color: color.onSurfaceVariant,
            marginTop: 12,
          }}
        >
          Máximo {max} recordatorios por visita
        </Text>
      )}
      <Notice tone="warning" style={{ marginTop: 16 }}>
        Los cambios en los recordatorios solo se aplicarán a las visitas que
        registres a partir de ahora. Las visitas ya registradas conservarán sus
        recordatorios originales.
      </Notice>
      <Button
        type="contained"
        onPress={() => onSave(draft)}
        isloanding={isSaving}
        disabled={isSaving}
        style={{ marginTop: 12, borderRadius: 10, paddingVertical: 6 }}
      >
        Guardar
      </Button>
    </View>
  );
}
