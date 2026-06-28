import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Chip } from "@/src/presentation/ui/chips/chip";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import { Title } from "@/src/presentation/ui/texts/title";
import { View } from "react-native";
import { RegisterVisitButton } from "../../components/register-visit-button";
import { VisitHistory } from "./visit-history";

export function VisitHistoryCard({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  const visitHistory = [];
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
            {`${visitHistory.length} Visitas`}
          </Text>
        </Chip>
      </View>
      <View>
        <VisitHistory history={visitHistory} />
        <RegisterVisitButton type={visit.type} visitId={visit.id} />
      </View>
    </Card>
  );
}
