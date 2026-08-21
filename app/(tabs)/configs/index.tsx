import { SafeArea } from "@/src/presentation/libraries/safe-area";
import SafeAreaProvider from "@/src/presentation/libraries/safe-area-provider";
import ConfigsScene from "@/src/presentation/modules/configs/scenes/configs.scene";

export default function TabConfigsScreen() {
  return (
    <SafeAreaProvider>
      <SafeArea>
        <ConfigsScene />
      </SafeArea>
    </SafeAreaProvider>
  );
}
