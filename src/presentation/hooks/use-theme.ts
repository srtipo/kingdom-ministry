import { useTheme } from "react-native-paper";
import { Colors } from "../constants/theme";

export type AppTheme = {
  colors: typeof Colors.light;
  LighTheme: {
    colors: typeof Colors.light;
  };
  DarkTheme: {
    colors: typeof Colors.dark;
  };
};

export const useAppTheme = () => useTheme<AppTheme>();
