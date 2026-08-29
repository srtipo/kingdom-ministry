import { SafeArea } from "@/src/presentation/libraries/safe-area";
import VisitDetailScene from "@/src/presentation/modules/visits/scenes/visit-detail.scene";
import { useLocalSearchParams } from "expo-router";

export default function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeArea>
      <VisitDetailScene id={id} />
    </SafeArea>
  );
}
