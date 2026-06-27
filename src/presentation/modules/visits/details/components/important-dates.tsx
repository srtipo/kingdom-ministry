import { formatDate } from "@/src/presentation/helpers/format-date";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Title } from "@/src/presentation/ui/texts/title";
import { View } from "react-native";
import { useGetDateStatusColor } from "../../helpers/get-date-color";
import { IVisitModel } from "@/src/core/modules/visits/interfaces/visit-model.interface";
import { VisitDateCard } from "./visit-date-card";

export function ImportantDates({ visit }: { visit: IVisitModel }) {
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
        <Icon type={"calendar-outline"} size={25} color={colors.primary} />
        <Title type={"large"} color={colors.onSurface} fontWeight={"bold"}>
          {"Fechas Importantes"}
        </Title>
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
