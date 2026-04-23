import VisitOrganizerScene from "@/modules/visit/scenes/visit-organizer.scene";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <VisitOrganizerScene />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
