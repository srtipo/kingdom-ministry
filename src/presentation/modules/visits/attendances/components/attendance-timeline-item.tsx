import { IAttendance } from "@/src/core/modules/visits/interfaces/attendance.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Text } from "@/src/presentation/ui/texts/text";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { View } from "react-native";

dayjs.locale("es");

interface AttendanceTimelineItemProps {
  attendance: IAttendance;
  isFirst: boolean;
  isLast: boolean;
}

export function AttendanceTimelineItem({
  attendance,
  isFirst,
  isLast,
}: AttendanceTimelineItemProps) {
  const colors = useThemeColor();
  const dotColor = isFirst ? colors.primary : colors.outline;
  const formattedDate = dayjs(attendance.date).format(
    "DD [de] MMMM, YYYY - hh:mm A",
  );

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 20,
          paddingTop: 6,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: dotColor,
          }}
        />
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: colors.outlineVariant,
              marginTop: 4,
            }}
          />
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          paddingBottom: isLast ? 0 : 16,
          gap: 6,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text type="small" color={colors.onSurfaceVariant}>
            {formattedDate}
          </Text>
          {isFirst && (
            <Chip compact opacity={0.6}>
              <Text type="small" fontWeight="bold" color={colors.primary}>
                Más reciente
              </Text>
            </Chip>
          )}
        </View>
        {attendance.notes && (
          <Text type="medium" color={colors.onSurface}>
            {attendance.notes}
          </Text>
        )}
      </View>
    </View>
  );
}
