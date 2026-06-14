import { formatDate } from "@/src/presentation/helpers/format-date";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { View } from "react-native";
import { useGetDateStatusColor } from "../../helpers/get-date-color";
import { IVisitDetail } from "../types/visit-detail.interface";
import { VisitDateCard } from "./visit-date-card";

export function ImportantDates({ visit }: { visit: IVisitDetail }) {
  const colors = useThemeColor();
  const visitChipColor = useGetDateStatusColor(visit.next_visit);

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
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon type={"calendar-outline"} size={20} color={colors.primary} />
        <Text type={"large"} color={colors.onSurface} fontWeight={"bold"}>
          {"Fecha Importantes"}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBlock: 10,
        }}
      >
        <VisitDateCard
          icon={
            <Icon type={"clock-outline"} size={20} color={colors.primary} />
          }
          color={colors.elevation.level1}
          label={"Ültima visita"}
          date={formatDate(visit.last_visit)}
        />
        <VisitDateCard
          icon={
            <Icon type={"calendar-outline"} size={20} color={colors.primary} />
          }
          color={visitChipColor}
          label={"Próxima visita"}
          date={formatDate(visit.next_visit)}
        />
      </View>
    </Card>
  );
}
