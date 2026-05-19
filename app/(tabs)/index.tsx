import { SafeArea } from "@/libraries/safe-area";
import SafeAreaProvider from "@/libraries/safe-area-provider";
import VisitOrganizerScene from "@/modules/visit/scenes/visit-organizer.scene";
import { SnackBarProvider } from "@/ui/snackbars/snackbar";

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
