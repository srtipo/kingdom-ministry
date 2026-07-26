import { IAttendance } from "@/src/core/modules/visits/interfaces/attendance.interface";
import { Divider } from "@/src/presentation/ui/dividers/divider";
import { View } from "react-native";
import { AttendanceTimelineItem } from "./attendance-timeline-item";
import { NoAttendanceHistory } from "./no-attendance-history";

export function AttendanceHistory({ history }: { history: IAttendance[] }) {
  if (history.length === 0) {
    return (
      <View style={{ height: 200 }}>
        <NoAttendanceHistory />
      </View>
    );
  }
  return (
    <View style={{ paddingTop: 20 }}>
      {history.map((attendance, index) => (
        <View key={attendance.id}>
          <View style={{ paddingInline: 20 }}>
            <AttendanceTimelineItem
              attendance={attendance}
              isFirst={index === 0}
              isLast={index === history.length - 1}
            />
          </View>
          {index < history.length - 1 && <Divider my={12} />}
        </View>
      ))}
    </View>
  );
}
