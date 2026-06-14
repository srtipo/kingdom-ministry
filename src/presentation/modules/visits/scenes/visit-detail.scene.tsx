import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";

import { Loading } from "@/src/presentation/ui/loaders/loading";
import { Text } from "@/src/presentation/ui/texts/text";
import { ScrollView, View } from "react-native";
import { GeneralInfo } from "../details/components/general-info";
import { ImportantDates } from "../details/components/important-dates";
import { VisitHistory } from "../details/components/visit-history";
import { useGetVisitDetail } from "../details/hooks/get-visit-datail";

export default function VisitDetailScene({ id }: { id: string }) {
  const colors = useThemeColor();
  const { data, isLoading } = useGetVisitDetail(id);
  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <Text>Visit not found</Text>;
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 10, display: "flex", gap: 10 }}>
        <GeneralInfo visit={data} />
        <ImportantDates visit={data} />
        <VisitHistory />
      </View>
    </ScrollView>
  );
}
