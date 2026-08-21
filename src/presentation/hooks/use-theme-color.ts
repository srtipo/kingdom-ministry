import { useAppTheme } from "./use-theme";

export function useThemeColor() {
  const theme = useAppTheme();
  return theme.colors;
}
