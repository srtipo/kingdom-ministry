/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#0f5abd",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(216, 226, 255)",
    onPrimaryContainer: "rgb(0, 26, 65)",
    secondary: "rgb(34, 95, 166)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(213, 227, 255)",
    onSecondaryContainer: "rgb(0, 28, 59)",
    tertiary: "rgb(113, 85, 116)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(251, 215, 252)",
    onTertiaryContainer: "rgb(41, 19, 45)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(254, 251, 255)",
    onBackground: "rgb(27, 27, 31)",
    surface: "rgb(254, 251, 255)",
    onSurface: "rgb(27, 27, 31)",
    surfaceVariant: "rgb(225, 226, 236)",
    onSurfaceVariant: "rgb(68, 71, 79)",
    outline: "rgb(116, 119, 127)",
    outlineVariant: "rgb(196, 198, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 51)",
    inverseOnSurface: "rgb(242, 240, 244)",
    inversePrimary: "rgb(173, 198, 255)",
    elevation: {
      level0: "transparent",
      level1: "hsl(234, 47%, 97%)",
      level2: "hsl(228, 43%, 95%)",
      level3: "hsl(225, 48%, 93%)",
      level4: "hsl(221, 50%, 93%)",
      level5: "hsl(219, 52%, 92%)",
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)",
    danger: "#fd5448",
    chips: {
      good: "#cfeaff",
      bad: "#ffdbcf",
      warning: "#ffffcf",
    },

    visitType: {
      visit: "rgba(5, 150, 105, 0.1)",
      visitGradient: "rgba(5, 150, 105, 0.25)",
      onVisit: "#065f46",
      onVisitSoft: "#10b981",
      course: "rgba(124, 58, 237, 0.1)",
      courseGradient: "rgba(124, 58, 237, 0.25)",
      onCourse: "#6d28d9",
      onCourseSoft: "#a78bfa",
    },
    // review colors
    card: "rgb(255, 255, 255)",
    text: "#1F63C4",
    border: "rgb(255, 255, 255)",
    notification: "rgb(255, 255, 255)",
  },

  dark: {
    primary: "rgb(173, 198, 255)",
    onPrimary: "rgb(0, 46, 104)",
    primaryContainer: "rgb(0, 68, 147)",
    onPrimaryContainer: "rgb(216, 226, 255)",
    secondary: "rgb(167, 200, 255)",
    onSecondary: "rgb(0, 48, 96)",
    secondaryContainer: "rgb(0, 71, 135)",
    onSecondaryContainer: "rgb(213, 227, 255)",
    tertiary: "rgb(222, 188, 223)",
    onTertiary: "rgb(64, 40, 67)",
    tertiaryContainer: "rgb(88, 62, 91)",
    onTertiaryContainer: "rgb(251, 215, 252)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 31)",
    onBackground: "rgb(227, 226, 230)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(227, 226, 230)",
    surfaceVariant: "rgb(68, 71, 79)",
    onSurfaceVariant: "rgb(196, 198, 208)",
    outline: "rgb(142, 144, 153)",
    outlineVariant: "rgb(68, 71, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(227, 226, 230)",
    inverseOnSurface: "rgb(48, 48, 51)",
    inversePrimary: "rgb(15, 91, 188)",
    danger: "#fd5448",
    elevation: {
      level0: "transparent",
      level1: "hsl(225, 11%, 15%)",
      level2: "hsl(228, 11%, 17%)",
      level3: "hsl(226, 13%, 19%)",
      level4: "hsl(226, 13%, 20%)",
      level5: "hsl(224, 14%, 21%)",
    },
    surfaceDisabled: "rgba(227, 226, 230, 0.12)",
    onSurfaceDisabled: "rgba(227, 226, 230, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)",
    chips: {
      good: "#cfeaff",
      bad: "#ffdbcf",
      warning: "#ffffcf",
    },
    visitType: {
      visit: "rgba(52, 211, 153, 0.12)",
      visitGradient: "rgba(52, 211, 153, 0.25)",
      onVisit: "#34d399",
      onVisitSoft: "#6ee7b7",
      course: "rgba(167, 139, 250, 0.12)",
      courseGradient: "rgba(167, 139, 250, 0.25)",
      onCourse: "#a78bfa",
      onCourseSoft: "#c4b5fd",
    },

    // review colors
    card: "rgb(255, 255, 255)",
    text: "#1F63C4",
    border: "rgb(255, 255, 255)",
    notification: "rgb(255, 255, 255)",
  },
};

export const customDarkTheme = {
  dark: true,
  roundness: 1,
  DarkTheme: {
    colors: Colors.dark,
  },
  LighTheme: {
    colors: Colors.light,
  },
  colors: Colors.dark,
};

export const customLightTheme = {
  dark: false,
  roundness: 1,
  DarkTheme: {
    colors: Colors.dark,
  },
  LighTheme: {
    colors: Colors.light,
  },
  colors: Colors.light,
};
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
