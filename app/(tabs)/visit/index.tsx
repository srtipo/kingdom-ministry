import { SafeArea } from "@/src/presentation/libraries/safe-area";
import SafeAreaProvider from "@/src/presentation/libraries/safe-area-provider";
import VisitOrganizerScene from "@/src/presentation/modules/visits/scenes/visit-organizer.scene";
import { SnackBarProvider } from "@/src/presentation/ui/snackbars/snackbar";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeArea>
        <SnackBarProvider>
          <VisitOrganizerScene />
        </SnackBarProvider>
      </SafeArea>
    </SafeAreaProvider>
  );
}
