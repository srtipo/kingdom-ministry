import { useColorScheme } from "./use-color-scheme.web";
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
