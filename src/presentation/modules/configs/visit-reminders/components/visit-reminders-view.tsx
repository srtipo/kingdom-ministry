import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import { formatReminder } from "../helpers/reminder-conversion";
import { VisitReminder } from "../types/visit-reminder";

export default function VisitRemindersView({
  value,
}: {
  value: VisitReminder[];
}) {
  const color = useThemeColor();
  const total = value.length;
  return (
    <View style={{ gap: 6 }}>
      {value.map((reminder, index) => {
        const isFirst = index === 0;
        const isLast = index === total - 1;
        const positionLabel = isFirst
          ? "Primer recordatorio"
          : isLast && total > 1
            ? "Último recordatorio"
            : undefined;
        return (
          <View
            key={reminder.id ?? `reminder-view-${index}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 4,
              gap: 12,
            }}
          >
            <View
              style={{
                width: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: isFirst
                    ? color.primary
                    : color.onSurfaceVariant,
                }}
              />
              {!isLast ? (
                <View
                  style={{
                    width: 1,
                    flex: 1,
                    backgroundColor: color.outlineVariant,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1, height: 40 }}>
              <Text fontWeight="bold">{formatReminder(reminder)}</Text>
              {positionLabel ? (
                <Text style={{ color: color.onSurfaceVariant }}>
                  {positionLabel}
                </Text>
              ) : null}
            </View>
            <Icon
              type="bell-outline"
              size={20}
              color={color.onSurfaceVariant}
            />
          </View>
        );
      })}
    </View>
  );
}
