import { SafeAreaProvider as SAR } from "react-native-safe-area-context";

export default function SafeAreaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SAR>{children}</SAR>;
}
