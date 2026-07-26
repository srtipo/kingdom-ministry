import { IVisit } from "@/src/core/modules/visits/interfaces/visit.interface";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Card } from "@/src/presentation/ui/cards/card";
import { Divider } from "@/src/presentation/ui/dividers/divider";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Title } from "@/src/presentation/ui/texts/title";
import { View } from "react-native";
import { useGetAttendanceHistory } from "../hooks/use-get-attendance-history";
import { AttendanceHistory } from "./attendance-history";
import { LoadMoreAttendanceButton } from "./load-more-attendance-button";

export function AttendanceHistoryCard({ visit }: { visit: IVisit }) {
  const colors = useThemeColor();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAttendanceHistory(visit.id);
  const items = data?.pages.flatMap((page) => page.items) ?? [];
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
          alignItems: "center",
          gap: 10,
          paddingInline: 20,
        }}
      >
        <Icon
          type={"file-document-outline"}
          size={25}
          color={colors.primary}
        />
        <Title type={"large"} color={colors.onSurface} fontWeight={"bold"}>
          {"Historial de visitas"}
        </Title>
      </View>
      <Divider marginTop={18} />
      <View style={{ gap: 20 }}>
        <AttendanceHistory history={items} />
        {hasNextPage && (
          <View style={{ paddingInline: 20 }}>
            <LoadMoreAttendanceButton
              onPress={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            />
          </View>
        )}
      </View>
    </Card>
  );
}
