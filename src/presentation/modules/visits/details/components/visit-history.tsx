import { View } from "react-native";
import { NoVisitHistory } from "./no-visit-history";

export function VisitHistory({ history }: { history: any[] }) {
  if (history.length === 0) {
    return (
      <View style={{ height: 200 }}>
        <NoVisitHistory />
      </View>
    );
  }
  return <></>;
}
