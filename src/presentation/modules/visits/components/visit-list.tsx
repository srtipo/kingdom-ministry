import { Loading } from "@/src/presentation/ui/loaders/loading";
import { ScrollMask } from "@/src/presentation/ui/mask";
import { FlatList, View } from "react-native";
import { IVisit } from "../type/visit.interface";
import { NoVisitCard } from "./no-visit-card";
import VisitCard from "./visit-card";

export default function VisitList({
  visits,
  isLoanding = false,
}: {
  visits?: IVisit[];
  isLoanding?: boolean;
}) {
  if (isLoanding) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading size={50} />
      </View>
    );
  }

  return (
    <ScrollMask top bottom edgeHeight={12}>
      <FlatList
        data={visits}
        renderItem={(item) => <VisitCard visit={item.item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<NoVisitCard />}
        refreshing={isLoanding}
      />
    </ScrollMask>
  );
}
