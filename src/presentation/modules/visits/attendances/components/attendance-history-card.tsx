import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Divider } from "@/src/presentation/ui/dividers/divider";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { Title } from "@/src/presentation/ui/texts/title";
import { View } from "react-native";
import { RegisterAttendanceButton } from "../../attendances/components/register-attendance-button";
import { useGetAttendanceHistory } from "../hooks/use-get-attendance-history";
import { AttendanceHistory } from "./attendance-history";

export function AttendanceHistoryCard({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  const { data: attendanceHistory = [] } = useGetAttendanceHistory(visit.id);
  return (
    <Card
      type="elevated"
      borderRadius={20}
      overflow="hidden"
      backgroundColor={colors.surface}
      paddingBlock={20}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingInline: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <>
            <Icon
              type={"file-document-outline"}
              size={25}
              color={colors.primary}
            />
            <Title type={"large"} color={colors.onSurface} fontWeight={"bold"}>
              {"Historial de visitas"}
            </Title>
          </>
        </View>
        <Chip>
          <Text type={"small"} fontWeight={"bold"} color={colors.primary}>
            {`${attendanceHistory.length} Visitas`}
          </Text>
        </Chip>
      </View>
      <Divider marginTop={18} />
      <View style={{ gap: 20 }}>
        <AttendanceHistory history={attendanceHistory} />
        <View style={{ paddingInline: 20 }}>
          <RegisterAttendanceButton type={visit.type} visitId={visit.id} />
        </View>
      </View>
    </Card>
  );
}
