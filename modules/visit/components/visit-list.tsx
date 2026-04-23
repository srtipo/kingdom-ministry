import { FlatList, View } from "react-native";
import { NoVisitCard } from "./no-visit-card";
import VisitCard, { VisitCardProps } from "./visit-card";

export default function VisitList({ visits }: { visits: VisitCardProps[] }) {
  if (visits.length === 0) {
    return <NoVisitCard />;
  }
  return (
    <FlatList
      data={visits}
      renderItem={(item) => <VisitCard visit={item.item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ flexGrow: 1 }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}
