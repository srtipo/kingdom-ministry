import { SafeArea } from "@/libraries/safe-area";
import SafeAreaProvider from "@/libraries/safe-area-provider";
import VisitOrganizerScene from "@/modules/visit/scenes/visit-organizer.scene";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeArea>
        <VisitOrganizerScene />
      </SafeArea>
    </SafeAreaProvider>
  );
}
