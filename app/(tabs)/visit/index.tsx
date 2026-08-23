import { SafeArea } from "@/src/presentation/libraries/safe-area";
import VisitOrganizerScene from "@/src/presentation/modules/visits/scenes/visit-organizer.scene";

export default function HomeScreen() {
  return (
    <SafeArea>
      <VisitOrganizerScene />
    </SafeArea>
  );
}
