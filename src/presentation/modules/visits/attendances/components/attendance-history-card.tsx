import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { Title } from "@/src/presentation/ui/texts/title";
import { View } from "react-native";
import { RegisterAttendanceButton } from "../../attendances/components/register-attendance-button";
import { AttendanceHistory } from "./attendance-history";

export function AttendanceHistoryCard({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  const attendanceHistory = [];
  return (
    <Card
      type="elevated"
      borderRadius={20}
      overflow="hidden"
      backgroundColor={colors.surface}
      padding={20}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
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
      <View>
        <AttendanceHistory history={attendanceHistory} />
        <RegisterAttendanceButton type={visit.type} visitId={visit.id} />
      </View>
    </Card>
  );
}
