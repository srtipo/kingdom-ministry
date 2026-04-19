import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppTheme } from "./use-theme";

export function useThemeColor() {
  const mode = useColorScheme() ?? "light";
  const theme = useAppTheme();
  if (mode === "dark") {
    return theme.DarkTheme.colors;
  } else {
    return theme.LighTheme.colors;
  }
}
