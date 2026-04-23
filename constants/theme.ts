/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: 'rgb(15, 91, 188)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(216, 226, 255)',
    onPrimaryContainer: 'rgb(0, 26, 65)',
    secondary: 'rgb(34, 95, 166)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(213, 227, 255)',
    onSecondaryContainer: 'rgb(0, 28, 59)',
    tertiary: 'rgb(113, 85, 116)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(251, 215, 252)',
    onTertiaryContainer: 'rgb(41, 19, 45)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(254, 251, 255)',
    onBackground: 'rgb(27, 27, 31)',
    surface: 'rgb(254, 251, 255)',
    onSurface: 'rgb(27, 27, 31)',
    surfaceVariant: 'rgb(225, 226, 236)',
    onSurfaceVariant: 'rgb(68, 71, 79)',
    outline: 'rgb(116, 119, 127)',
    outlineVariant: 'rgb(196, 198, 208)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(48, 48, 51)',
    inverseOnSurface: 'rgb(242, 240, 244)',
    inversePrimary: 'rgb(173, 198, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(242, 243, 252)',
      level2: 'rgb(235, 238, 250)',
      level3: 'rgb(228, 233, 248)',
      level4: 'rgb(225, 232, 247)',
      level5: 'rgb(221, 229, 246)',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(46, 48, 56, 0.4)',
    // review colors
    card: 'rgb(255, 255, 255)',
    text: '#1F63C4',
    border: 'rgb(255, 255, 255)',
    notification: 'rgb(255, 255, 255)',
  },

  dark: {
    primary: 'rgb(173, 198, 255)',
    onPrimary: 'rgb(0, 46, 104)',
    primaryContainer: 'rgb(0, 68, 147)',
    onPrimaryContainer: 'rgb(216, 226, 255)',
    secondary: 'rgb(167, 200, 255)',
    onSecondary: 'rgb(0, 48, 96)',
    secondaryContainer: 'rgb(0, 71, 135)',
    onSecondaryContainer: 'rgb(213, 227, 255)',
    tertiary: 'rgb(222, 188, 223)',
    onTertiary: 'rgb(64, 40, 67)',
    tertiaryContainer: 'rgb(88, 62, 91)',
    onTertiaryContainer: 'rgb(251, 215, 252)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(27, 27, 31)',
    onBackground: 'rgb(227, 226, 230)',
    surface: 'rgb(27, 27, 31)',
    onSurface: 'rgb(227, 226, 230)',
    surfaceVariant: 'rgb(68, 71, 79)',
    onSurfaceVariant: 'rgb(196, 198, 208)',
    outline: 'rgb(142, 144, 153)',
    outlineVariant: 'rgb(68, 71, 79)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(227, 226, 230)',
    inverseOnSurface: 'rgb(48, 48, 51)',
    inversePrimary: 'rgb(15, 91, 188)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(34, 36, 42)',
      level2: 'rgb(39, 41, 49)',
      level3: 'rgb(43, 46, 56)',
      level4: 'rgb(45, 48, 58)',
      level5: 'rgb(47, 51, 62)',
    },
    surfaceDisabled: 'rgba(227, 226, 230, 0.12)',
    onSurfaceDisabled: 'rgba(227, 226, 230, 0.38)',
    backdrop: 'rgba(46, 48, 56, 0.4)',

    // review colors
    card: 'rgb(255, 255, 255)',
    text: '#1F63C4',
    border: 'rgb(255, 255, 255)',
    notification: 'rgb(255, 255, 255)',
  },
};

export const customDarkTheme = {
  dark: true,
  mode: 'adaptive' as const,
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
  mode: 'adaptive' as const,
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
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
