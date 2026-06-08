import { SafeArea } from "@/src/presentation/libraries/safe-area";
import SafeAreaProvider from "@/src/presentation/libraries/safe-area-provider";
import VisitDetailScene from "@/src/presentation/modules/visits/scenes/visit-detail.scene";
import { SnackBarProvider } from "@/src/presentation/ui/snackbars/snackbar";
import { useLocalSearchParams } from "expo-router";

export default function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaProvider>
      <SafeArea>
        <SnackBarProvider>
          <VisitDetailScene id={Number(id)} />
        </SnackBarProvider>
      </SafeArea>
    </SafeAreaProvider>
  );
}
