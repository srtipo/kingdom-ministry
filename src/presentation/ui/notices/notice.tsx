import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Icon } from "@/src/presentation/ui/icons/icon";
import { Text } from "@/src/presentation/ui/texts/text";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";
import styled from "styled-components/native";
import {
  border,
  BorderProps,
  borderRadius,
  BorderRadiusProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from "styled-system";

export type NoticeTone = "warning" | "info" | "error";

interface NoticeStyledProps
  extends
    FlexboxProps,
    SpaceProps,
    BorderProps,
    ColorProps,
    LayoutProps,
    PositionProps,
    BorderRadiusProps {
  bg: string;
  borderColor: string;
}

const NoticeWrapper = styled(View).attrs<NoticeStyledProps>(() => ({}))`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  border-width: 1px;
  background-color: ${(p) => p.bg};
  border-color: ${(p) => p.borderColor};
  ${flexbox}
  ${space}
  ${border}
  ${borderRadius}
  ${color}
  ${layout}
  ${position}
`;

const TONE_ICONS: Record<NoticeTone, (typeof MaterialCommunityIcons)["name"]> =
  {
    warning: "alert",
    info: "information",
    error: "alert-circle",
  };

export function Notice({
  icon,
  tone = "warning",
  children,
  style,
  ...props
}: {
  icon?: (typeof MaterialCommunityIcons)["name"];
  tone?: NoticeTone;
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
}) {
  const colors = useThemeColor();
  const palette =
    tone === "warning"
      ? {
          bg: colors.notice.warning.bg,
          border: colors.notice.warning.border,
          icon: colors.notice.warning.icon,
          text: colors.notice.warning.text,
        }
      : tone === "info"
        ? {
            bg: colors.primaryContainer,
            border: colors.primary,
            icon: colors.primary,
            text: colors.onPrimaryContainer,
          }
        : {
            bg: colors.errorContainer,
            border: colors.error,
            icon: colors.error,
            text: colors.onErrorContainer,
          };
  const resolvedIcon = icon ?? TONE_ICONS[tone];
  return (
    <NoticeWrapper
      accessibilityRole="alert"
      bg={palette.bg}
      borderColor={palette.border}
      style={style}
      borderRadius={10}
      {...props}
    >
      <Icon size={20} type={resolvedIcon} color={palette.icon} />
      <Text style={{ flex: 1, color: palette.text }}>{children}</Text>
    </NoticeWrapper>
  );
}